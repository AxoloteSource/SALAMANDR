/**
 * La API entrega los tokens en el cuerpo JSON, así que no es posible usar cookies HttpOnly
 * sin cambiar el backend. Los valores almacenados aquí son accesibles desde JavaScript y
 * quedan expuestos ante XSS: no deben imprimirse ni enviarse a hosts no autorizados.
 */
const ACCESS_TOKEN_KEY = 'authToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const SESSION_ID_KEY = 'authSessionId'
const USER_KEY = 'user'

export const AUTH_STORAGE_KEYS = {
  accessToken: ACCESS_TOKEN_KEY,
  refreshToken: REFRESH_TOKEN_KEY,
  sessionId: SESSION_ID_KEY,
  user: USER_KEY
} as const

export interface IStoredSession {
  accessToken: string | null
  refreshToken: string | null
}

export interface IAuthTokens {
  accessToken: string
  refreshToken: string
}

const isBrowser = (): boolean => typeof window !== 'undefined'

const readValue = (key: string): string | null => (isBrowser() ? window.localStorage.getItem(key) : null)

const writeValue = (key: string, value: string): void => {
  if (isBrowser()) {
    window.localStorage.setItem(key, value)
  }
}

const removeValue = (key: string): void => {
  if (isBrowser()) {
    window.localStorage.removeItem(key)
  }
}

export const getAccessToken = (): string | null => readValue(ACCESS_TOKEN_KEY)

export const getRefreshToken = (): string | null => readValue(REFRESH_TOKEN_KEY)

export const getSessionId = (): string | null => readValue(SESSION_ID_KEY)

export const storeSessionId = (sessionId: string): void => {
  writeValue(SESSION_ID_KEY, sessionId)
}

export const getStoredSession = (): IStoredSession => ({
  accessToken: getAccessToken(),
  refreshToken: getRefreshToken()
})

export const hasStoredSession = (): boolean => Boolean(getAccessToken() || getRefreshToken())

export const storeTokens = ({ accessToken, refreshToken }: IAuthTokens): void => {
  writeValue(ACCESS_TOKEN_KEY, accessToken)

  if (refreshToken) {
    writeValue(REFRESH_TOKEN_KEY, refreshToken)
  } else {
    removeValue(REFRESH_TOKEN_KEY)
  }
}

export const getStoredUser = <TUser>(): TUser | null => {
  const storedUser = readValue(USER_KEY)

  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser) as TUser
  } catch {
    removeValue(USER_KEY)
    return null
  }
}

export const storeUser = (user: unknown): void => {
  writeValue(USER_KEY, JSON.stringify(user))
}

export const clearStoredUser = (): void => {
  removeValue(USER_KEY)
}

export const clearStoredSession = (): void => {
  removeValue(ACCESS_TOKEN_KEY)
  removeValue(REFRESH_TOKEN_KEY)
  removeValue(SESSION_ID_KEY)
  removeValue(USER_KEY)
}
