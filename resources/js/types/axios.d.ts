import 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    _authRetry?: boolean
    _authSessionGeneration?: number
    _authSessionId?: string
  }

  export interface InternalAxiosRequestConfig {
    _authRetry?: boolean
    _authSessionGeneration?: number
    _authSessionId?: string
  }
}
