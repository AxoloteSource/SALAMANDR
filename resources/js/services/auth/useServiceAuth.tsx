import { ApisEnum } from '@/configs/apisEnum'
import { usePOST } from '@/hooks/useApi'

/**
 * Real Authxolote login (HAG-18).
 *
 * POST {VITE_AUTH_URL}/api/v1/login  { email, password }
 *   -> LoginResource: { user: { id, name, email, role_id, role, ... }, access_token }
 * The axios response interceptor unwraps `data.data ?? data`, so callers receive
 * `{ user, access_token }` on success.
 */
export const useServiceLogin = () => usePOST({ url: '/api/v1/login', customHost: ApisEnum.BaseLogin })
