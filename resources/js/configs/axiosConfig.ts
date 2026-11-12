import { ApisEnum } from '@/configs/apisEnum'
import { AuthEndpoints, isPublicEndpoint } from '@/configs/authEndpoints'
import { expireSession, getSessionGeneration, refreshAccessToken } from '@/lib/authSession'
import { getAccessToken, getRefreshToken, getSessionId } from '@/lib/authStorage'
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'

// In demo mode the stored token is fake, so real endpoints legitimately return
// 401. Without this guard every authed page would wipe the session and bounce
// to /login. Token refresh and session expiry only run with real auth.
const REAL_AUTH = import.meta.env.VITE_REAL_AUTH === 'true'

export const axiosApi: AxiosInstance = axios.create({
  baseURL: String(ApisEnum.BaseUrl),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

interface IApiErrorPayload {
  message?: string
}

const getCurrentOrigin = (): string => (typeof window !== 'undefined' ? window.location.origin : 'http://localhost')

const resolveUrl = (value: string, base?: string): URL | null => {
  try {
    return new URL(value, base ?? getCurrentOrigin())
  } catch {
    return null
  }
}

const ABSOLUTE_URL_PATTERN = /^[a-z][a-z\d+\-.]*:\/\//i

const resolveRequestUrl = (config: Pick<InternalAxiosRequestConfig, 'url' | 'baseURL'>): URL | null => {
  const currentOrigin = getCurrentOrigin()
  const requestUrl = config.url ?? ''

  if (ABSOLUTE_URL_PATTERN.test(requestUrl)) {
    return resolveUrl(requestUrl)
  }

  const baseURL = config.baseURL ? (resolveUrl(config.baseURL, currentOrigin)?.toString() ?? currentOrigin) : currentOrigin

  if (!requestUrl) {
    return resolveUrl(baseURL)
  }

  return resolveUrl(`${baseURL.replace(/\/+$/, '')}/${requestUrl.replace(/^\/+/, '')}`)
}

const getAuthorizedOrigins = (): Set<string> => {
  const origins = new Set<string>()

  for (const base of [ApisEnum.BaseUrl, ApisEnum.BaseLogin, ApisEnum.BaseMessages]) {
    const url = resolveUrl(String(base))

    if (url) {
      origins.add(url.origin)
    }
  }

  return origins
}

const isAuthorizedRequest = (config: Pick<InternalAxiosRequestConfig, 'url' | 'baseURL'>): boolean => {
  const requestUrl = resolveRequestUrl(config)

  return requestUrl ? getAuthorizedOrigins().has(requestUrl.origin) : false
}

const isPublicRequest = (config: Pick<InternalAxiosRequestConfig, 'url' | 'baseURL'>): boolean => {
  const requestUrl = resolveRequestUrl(config)

  return requestUrl ? isPublicEndpoint(requestUrl.pathname) : false
}

const isRefreshRequest = (config: Pick<InternalAxiosRequestConfig, 'url' | 'baseURL'>): boolean =>
  Boolean(resolveRequestUrl(config)?.pathname.endsWith(AuthEndpoints.RefreshToken))

const getRequestAccessToken = (config: InternalAxiosRequestConfig): string | null => {
  const authorizationHeader = config.headers.get('Authorization')

  if (typeof authorizationHeader !== 'string' || !authorizationHeader.startsWith('Bearer ')) {
    return null
  }

  return authorizationHeader.slice('Bearer '.length)
}

axiosApi.interceptors.request.use((config) => {
  const token = getAccessToken()

  if (token && isAuthorizedRequest(config) && !isPublicRequest(config)) {
    config.headers.set('Authorization', `Bearer ${token}`)
    config._authSessionGeneration = getSessionGeneration()
    config._authSessionId = getSessionId() ?? undefined
  } else {
    config.headers.delete('Authorization')
    delete config._authSessionGeneration
    delete config._authSessionId
  }

  return config
})

axiosApi.interceptors.response.use(
  (response) => {
    if ((response.status === 200 || response.status === 201) && response.config.responseType != 'blob' && response.data != null) {
      response.data = response.data.data ?? response.data
    }
    return response
  },
  async (error: AxiosError<IApiErrorPayload>) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error)
    }

    const originalConfig = error.config

    if (!REAL_AUTH || !originalConfig || error.response?.status !== 401) {
      return Promise.reject(error)
    }

    if (originalConfig._authRetry || isRefreshRequest(originalConfig) || isPublicRequest(originalConfig)) {
      return Promise.reject(error)
    }

    if (originalConfig._authSessionGeneration !== undefined && originalConfig._authSessionGeneration !== getSessionGeneration()) {
      return Promise.reject(error)
    }

    if (originalConfig._authSessionId !== undefined && originalConfig._authSessionId !== getSessionId()) {
      return Promise.reject(error)
    }

    const requestAccessToken = getRequestAccessToken(originalConfig)

    if (!requestAccessToken) {
      return Promise.reject(error)
    }

    const currentAccessToken = getAccessToken()

    if (!currentAccessToken && !getRefreshToken()) {
      expireSession()
      return Promise.reject(error)
    }

    try {
      const accessToken =
        currentAccessToken && currentAccessToken !== requestAccessToken ? currentAccessToken : await refreshAccessToken(requestAccessToken)

      originalConfig._authRetry = true
      originalConfig.headers.set('Authorization', `Bearer ${accessToken}`)

      return axiosApi(originalConfig)
    } catch (refreshError) {
      return Promise.reject(refreshError)
    }
  }
)
