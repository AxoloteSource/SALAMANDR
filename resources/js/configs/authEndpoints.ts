export const AuthEndpoints = {
  Login: '/api/v1/login',
  RefreshToken: '/api/v1/refresh-token',
  Logout: '/api/v1/logout'
} as const

const PUBLIC_ENDPOINT_PATTERNS: RegExp[] = [
  /\/api\/v1\/login\/?$/,
  /\/api\/v1\/register\/?$/,
  /\/api\/v2\/register\/?$/,
  /\/api\/v1\/refresh-token\/?$/,
  /\/api\/v1\/recovery-password\/?$/,
  /\/api\/v1\/reset-password\/?$/,
  /\/api\/v1\/otp(?:\/.*)?$/,
  /\/api\/v2\/verify-email\/?$/
]

export const isPublicEndpoint = (pathname: string): boolean => PUBLIC_ENDPOINT_PATTERNS.some((pattern) => pattern.test(pathname))
