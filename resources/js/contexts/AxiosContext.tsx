import { ApisEnum } from '@/configs/apisEnum'
import { axiosApi } from '@/configs/axiosConfig'
import { useLogoutSync } from '@/hooks/useLogoutSync'
import { IUser } from '@/interfaces/models/User/user.interface'
import { clearSession, ensureSessionId, refreshAccessToken, revokeSession, startSession, subscribeAuthSession } from '@/lib/authSession'
import {
  AUTH_STORAGE_KEYS,
  clearStoredUser,
  getAccessToken,
  getRefreshToken,
  getStoredSession,
  getStoredUser,
  hasStoredSession,
  storeUser
} from '@/lib/authStorage'
import { queryClient } from '@/lib/queryClient'
import axios from 'axios'
import { createContext, useCallback, useEffect, useState } from 'react'
import { IAuthContextType } from './interfaces/IAuthContextType'
import { IAuthProviderProps } from './interfaces/IAuthProviderProps'

export const AxiosContext = createContext<IAuthContextType | undefined>(undefined)

export const AxiosProvider = ({ children }: IAuthProviderProps) => {
  const [authToken, setAuthToken] = useState<string | null>(() => getAccessToken())
  const [user, setUser] = useState<IUser | null>(() => getStoredUser<IUser>())
  const [isInitializing, setIsInitializing] = useState<boolean>(() => hasStoredSession())
  const [sessionExpired, setSessionExpired] = useState<boolean>(false)

  const configUser = useCallback((nextUser: IUser | null) => {
    if (nextUser) {
      storeUser(nextUser)
    } else {
      clearStoredUser()
    }

    setUser(nextUser)
  }, [])

  const clearPrivateState = useCallback(
    (expired: boolean) => {
      setAuthToken(null)
      configUser(null)
      setSessionExpired(expired)
      setIsInitializing(false)
      void queryClient.cancelQueries()
      queryClient.clear()
    },
    [configUser]
  )

  useEffect(
    () =>
      subscribeAuthSession((event) => {
        if (event.type === 'tokens-refreshed') {
          setAuthToken(event.tokens.accessToken)
          return
        }

        clearPrivateState(event.type === 'session-expired')
      }),
    [clearPrivateState]
  )

  // Keep the React state in sync when another tab rotates the access token.
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === AUTH_STORAGE_KEYS.accessToken && event.newValue) {
        setAuthToken(event.newValue)
        setSessionExpired(false)
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Validate the stored session before rendering protected routes.
  useEffect(() => {
    let cancelled = false

    const bootstrapSession = async () => {
      if (!getAccessToken() && !getRefreshToken()) {
        setIsInitializing(false)
        return
      }

      try {
        if (!getAccessToken() && getRefreshToken()) {
          await refreshAccessToken()
        }

        ensureSessionId()

        const response = await axiosApi.post('/api/v1/me', {}, { baseURL: String(ApisEnum.BaseLogin), timeout: 15_000 })
        // The response envelope { status, message, data: { user } } is unwrapped
        // by the interceptor to { user }.
        const payload = response.data as { user?: IUser } | IUser
        const userData = (payload as { user?: IUser })?.user ?? payload

        if (!cancelled && userData) {
          configUser(userData as IUser)
        }

        if (!cancelled) {
          setAuthToken(getAccessToken())
        }
      } catch (error) {
        if (cancelled) {
          return
        }

        if (axios.isAxiosError(error)) {
          if (!error.response) {
            console.warn('[auth] unable to restore session', { reason: 'network' })
          } else if (error.response.status !== 401) {
            console.warn('[auth] unable to restore session', { status: error.response.status })
          }
        }
      } finally {
        if (!cancelled) {
          setIsInitializing(false)
        }
      }
    }

    void bootstrapSession()

    return () => {
      cancelled = true
    }
  }, [configUser])

  const logout = useCallback(async () => {
    const session = getStoredSession()

    clearPrivateState(false)
    clearSession()

    await revokeSession(session)
  }, [clearPrivateState])

  // Synchronize logout across all browser tabs
  useLogoutSync(logout)

  const updateUser = useCallback(
    (nextUser: IUser) => {
      configUser(nextUser)
    },
    [configUser]
  )

  const fetchUser = useCallback(async () => {
    if (!getAccessToken() && !getRefreshToken()) return

    try {
      const response = await axiosApi.post('/api/v1/me', {}, { baseURL: String(ApisEnum.BaseLogin), timeout: 15_000 })
      // The response envelope { status, message, data: { user } } is unwrapped
      // by the interceptor to { user }.
      const payload = response.data as { user?: IUser } | IUser
      const userData = (payload as { user?: IUser })?.user ?? payload

      if (userData) {
        configUser(userData as IUser)
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status !== 401) {
        console.warn('[auth] unable to fetch user profile', { status: error.response.status })
      }
    }
  }, [configUser])

  const saveAuth = useCallback(
    (accessToken: string, refreshToken: string, nextUser: IUser) => {
      startSession({ accessToken, refreshToken })
      setAuthToken(accessToken)
      setSessionExpired(false)
      configUser(nextUser)
    },
    [configUser]
  )

  const isAuth = !!authToken
  const businessId = user?.business_id ?? 1

  const value: IAuthContextType = {
    authToken,
    user,
    isAuth,
    isInitializing,
    sessionExpired,
    businessId,
    saveAuth,
    updateUser,
    fetchUser,
    logout,
    axiosApi
  }

  return <AxiosContext.Provider value={value}>{children}</AxiosContext.Provider>
}
