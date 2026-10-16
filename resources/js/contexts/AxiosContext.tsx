import { axiosApi } from '@/configs/axiosConfig'
import { useLogoutSync } from '@/hooks/useLogoutSync'
import { IUser } from '@/interfaces/models/User/user.interface'
import { createContext, useCallback, useEffect, useState } from 'react'
import { IAuthContextType } from './interfaces/IAuthContextType'
import { IAuthProviderProps } from './interfaces/IAuthProviderProps'

export const AxiosContext = createContext<IAuthContextType | undefined>(undefined)

export const AxiosProvider = ({ children }: IAuthProviderProps) => {
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('authToken'))
  const [user, setUser] = useState<IUser | null>(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null)

  const configureAxiosHeaders = (token: string | null) => {
    if (token) {
      axiosApi.defaults.headers.common['Authorization'] = `Bearer ${token}`
      localStorage.setItem('authToken', token)
    } else {
      delete axiosApi.defaults.headers.common['Authorization']
      localStorage.removeItem('authToken')
    }
    setAuthToken(token)
  }

  const configUser = (nextUser: IUser | null) => {
    if (nextUser) {
      localStorage.setItem('user', JSON.stringify(nextUser))
    } else {
      localStorage.removeItem('user')
    }
    setUser(nextUser)
  }

  const logout = useCallback(() => {
    configureAxiosHeaders(null)
    configUser(null)
    window.location.replace('/login')
  }, [])

  // Synchronize logout across all browser tabs
  useLogoutSync(logout)

  useEffect(() => {
    if (authToken) {
      axiosApi.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
    }
  }, [authToken])

  const updateUser = useCallback((nextUser: IUser) => {
    configUser(nextUser)
  }, [])

  const fetchUser = useCallback(async () => {
    if (!authToken) return
    try {
      const response = await axiosApi.get('/api/v1/me')
      const userData = response.data?.data ?? response.data
      if (userData) {
        configUser(userData as IUser)
      }
    } catch (error) {
      console.error('Error fetching user profile', error)
    }
  }, [authToken])

  const saveAuth = (accessToken: string, nextUser: IUser) => {
    try {
      configureAxiosHeaders(accessToken)
      configUser(nextUser)
    } catch (error) {
      console.error('Authentication error', error)
      throw error
    }
  }

  const isAuth = !!authToken
  const businessId = user?.business_id ?? 1

  const value: IAuthContextType = {
    authToken,
    user,
    isAuth,
    businessId,
    saveAuth,
    updateUser,
    fetchUser,
    logout,
    axiosApi
  }

  return <AxiosContext.Provider value={value}>{children}</AxiosContext.Provider>
}
