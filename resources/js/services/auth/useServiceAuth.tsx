import { ILoginResponse } from '@/interfaces/response/IloginRersponse'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'

/**
 * Login service.
 *
 * TODO(HAG-1): SALAMANDR backend auth is not wired yet. This returns a demo
 * session so the SPA shell (login -> home) is fully demonstrable. Swap this for
 * the real endpoint, mirroring axolote-rewards-api:
 *   axiosApi.post('/api/v1/login', data, { baseURL: ApisEnum.BaseLogin })
 */
export const useServiceLogin = (): UseMutationResult<AxiosResponse<Record<string, unknown>>, Error, unknown> =>
  useMutation({
    mutationFn: async (data) => {
      const { email, password } = data as { email?: string; password?: string }

      if (!email || !password) {
        throw new Error('Credenciales incompletas')
      }

      const payload: ILoginResponse = {
        access_token: `demo.${btoa(email)}.token`,
        user: {
          id: 1,
          name: email.split('@')[0] || 'Demo',
          full_name: 'Demo User',
          email,
          business_id: 1,
          role: { key: 'admin', name: 'Admin' }
        }
      }

      return { data: payload } as unknown as AxiosResponse<Record<string, unknown>>
    }
  })
