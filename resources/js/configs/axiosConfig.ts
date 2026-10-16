import axios, { AxiosInstance } from 'axios'
import { ApisEnum } from './apisEnum'

export const axiosApi: AxiosInstance = axios.create({
  baseURL: String(ApisEnum.BaseUrl),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

const authTokenKey = 'authToken'
const userKey = 'user'

// 401 auto-logout is only correct once REAL auth is wired. During the demo
// phase the token is fake, so real endpoints legitimately 401 — without this
// guard every authed page would wipe the session and bounce to /login.
const REAL_AUTH = import.meta.env.VITE_REAL_AUTH === 'true'

const getStoredToken = (): string | null => (typeof window !== 'undefined' ? window.localStorage.getItem(authTokenKey) : null)

const storedToken = getStoredToken()

if (storedToken) {
  axiosApi.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
}

axiosApi.interceptors.request.use((config) => {
  const token = getStoredToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  } else {
    delete config.headers.Authorization
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
  (error) => {
    if (error.response?.status === 401 && REAL_AUTH && typeof window !== 'undefined') {
      window.localStorage.removeItem(authTokenKey)
      window.localStorage.removeItem(userKey)
      // Guard against a redirect loop when a 401 happens while already on /login.
      if (!window.location.pathname.startsWith('/login')) {
        window.location.replace('/login')
      }
    }

    return Promise.reject(error)
  }
)
