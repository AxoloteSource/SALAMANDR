import { ApisEnum } from '@/configs/apisEnum'
import { AuthEndpoints } from '@/configs/authEndpoints'
import {
  clearStoredSession,
  getAccessToken,
  getRefreshToken,
  getSessionId,
  storeSessionId,
  storeTokens,
  type IAuthTokens,
  type IStoredSession
} from '@/lib/authStorage'
import axios, { type AxiosInstance } from 'axios'

interface IRefreshTokenPayload {
  access_token?: unknown
  refresh_token?: unknown
}

interface IRefreshTokenResponse {
  data?: IRefreshTokenPayload
}

export type AuthSessionEvent = { type: 'tokens-refreshed'; tokens: IAuthTokens } | { type: 'session-expired' } | { type: 'session-cleared' }

type AuthSessionListener = (event: AuthSessionEvent) => void

export class AuthSessionError extends Error {
  constructor(
    message: string,
    public readonly code: 'missing-refresh-token' | 'session-changed' | 'refresh-rejected'
  ) {
    super(message)
    this.name = 'AuthSessionError'
  }
}

export const authHttpClient: AxiosInstance = axios.create({
  baseURL: String(ApisEnum.BaseLogin),
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

const listeners = new Set<AuthSessionListener>()

let refreshPromise: Promise<string> | null = null
let sessionGeneration = 0
let lastExpiredGeneration = -1

export const subscribeAuthSession = (listener: AuthSessionListener): (() => void) => {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

export const getSessionGeneration = (): number => sessionGeneration

const emit = (event: AuthSessionEvent): void => {
  listeners.forEach((listener) => listener(event))
}

const getResponseStatus = (error: unknown): number | undefined => (axios.isAxiosError(error) ? error.response?.status : undefined)

const logRefreshDiagnostic = (status: number): void => {
  console.warn('[auth] token refresh rejected', { status })
}

const parseTokens = (payload: IRefreshTokenResponse): IAuthTokens => {
  const accessToken = payload.data?.access_token
  const refreshToken = payload.data?.refresh_token

  if (typeof accessToken !== 'string' || !accessToken || typeof refreshToken !== 'string' || !refreshToken) {
    throw new Error('Invalid refresh token response')
  }

  return { accessToken, refreshToken }
}

export const requestNewTokens = async (refreshToken: string): Promise<IAuthTokens> => {
  const response = await authHttpClient.post<IRefreshTokenResponse>(AuthEndpoints.RefreshToken, {
    refresh_token: refreshToken
  })

  return parseTokens(response.data)
}

const createSessionId = (): string => {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export const ensureSessionId = (): void => {
  if (!getSessionId()) {
    storeSessionId(createSessionId())
  }
}

export const startSession = (tokens: IAuthTokens): void => {
  sessionGeneration += 1
  lastExpiredGeneration = -1
  refreshPromise = null
  storeSessionId(createSessionId())
  storeTokens(tokens)
}

export const clearSession = (): void => {
  sessionGeneration += 1
  lastExpiredGeneration = sessionGeneration
  refreshPromise = null
  clearStoredSession()
  emit({ type: 'session-cleared' })
}

export const expireSession = (): void => {
  if (lastExpiredGeneration === sessionGeneration) {
    return
  }

  sessionGeneration += 1
  lastExpiredGeneration = sessionGeneration
  refreshPromise = null
  clearStoredSession()
  emit({ type: 'session-expired' })
}

const expireSessionIfCurrent = (generation: number): boolean => {
  if (generation !== sessionGeneration) {
    return false
  }

  expireSession()
  return true
}

const runWithCrossTabLock = (callback: () => Promise<string>): Promise<string> => {
  if (typeof navigator !== 'undefined' && navigator.locks?.request) {
    return navigator.locks.request('salamandr-auth-refresh', async () => await callback()) as unknown as Promise<string>
  }

  return callback()
}

export const refreshAccessToken = (requestAccessToken?: string | null): Promise<string> => {
  const currentAccessToken = getAccessToken()

  if (requestAccessToken && currentAccessToken && currentAccessToken !== requestAccessToken) {
    return Promise.resolve(currentAccessToken)
  }

  if (refreshPromise) {
    return refreshPromise
  }

  const generation = sessionGeneration
  const initialSessionId = getSessionId()
  const initialRefreshToken = getRefreshToken()

  if (!initialRefreshToken) {
    expireSession()
    return Promise.reject(new AuthSessionError('No refresh token available', 'missing-refresh-token'))
  }

  const executeRefresh = async (): Promise<string> => {
    if (generation !== sessionGeneration || getSessionId() !== initialSessionId) {
      throw new AuthSessionError('The session changed before the refresh started', 'session-changed')
    }

    const refreshTokenBeforeRequest = getRefreshToken()

    if (!refreshTokenBeforeRequest) {
      expireSessionIfCurrent(generation)
      throw new AuthSessionError('No refresh token available', 'missing-refresh-token')
    }

    if (refreshTokenBeforeRequest !== initialRefreshToken) {
      const latestAccessToken = getAccessToken()

      if (latestAccessToken) {
        return latestAccessToken
      }
    }

    const accessTokenBeforeRequest = getAccessToken()

    if (requestAccessToken && accessTokenBeforeRequest && accessTokenBeforeRequest !== requestAccessToken) {
      return accessTokenBeforeRequest
    }

    try {
      const tokens = await requestNewTokens(refreshTokenBeforeRequest)

      if (generation !== sessionGeneration || getSessionId() !== initialSessionId) {
        throw new AuthSessionError('The session changed while refreshing', 'session-changed')
      }

      if (getRefreshToken() !== refreshTokenBeforeRequest) {
        const latestAccessToken = getAccessToken()

        if (latestAccessToken) {
          return latestAccessToken
        }

        throw new AuthSessionError('The session changed while refreshing', 'session-changed')
      }

      if (!initialSessionId) {
        storeSessionId(createSessionId())
      }

      storeTokens(tokens)
      emit({ type: 'tokens-refreshed', tokens })

      return tokens.accessToken
    } catch (error) {
      if (error instanceof AuthSessionError) {
        throw error
      }

      const status = getResponseStatus(error)

      if (status === 401) {
        if (generation !== sessionGeneration || getSessionId() !== initialSessionId) {
          throw new AuthSessionError('The session changed while refreshing', 'session-changed')
        }

        const latestRefreshToken = getRefreshToken()

        if (latestRefreshToken && latestRefreshToken !== refreshTokenBeforeRequest) {
          const latestAccessToken = getAccessToken()

          if (latestAccessToken) {
            return latestAccessToken
          }
        }

        expireSessionIfCurrent(generation)
        throw new AuthSessionError('The refresh token was rejected', 'refresh-rejected')
      }

      if (status === 422 || status === 429) {
        logRefreshDiagnostic(status)
      }

      throw error
    }
  }

  const promise = runWithCrossTabLock(executeRefresh).finally(() => {
    if (refreshPromise === promise) {
      refreshPromise = null
    }
  })

  refreshPromise = promise

  return promise
}

const sendLogoutRequest = (accessToken: string): Promise<unknown> =>
  authHttpClient.post(AuthEndpoints.Logout, undefined, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    timeout: 5_000
  })

export const revokeSession = async (session: IStoredSession): Promise<void> => {
  if (!session.accessToken && !session.refreshToken) {
    return
  }

  try {
    if (session.accessToken) {
      try {
        await sendLogoutRequest(session.accessToken)
        return
      } catch (error) {
        if (getResponseStatus(error) !== 401) {
          return
        }
      }
    }

    if (!session.refreshToken) {
      return
    }

    const renewedTokens = await requestNewTokens(session.refreshToken)
    await sendLogoutRequest(renewedTokens.accessToken)
  } catch {
    // El logout remoto es best-effort: la sesión local ya fue limpiada.
  }
}
