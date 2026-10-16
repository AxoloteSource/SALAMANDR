import { ApisEnum } from '@/configs/apisEnum'
import { useGET } from '@/hooks/useApi'

const url = '/api/v1/user-lists'
const urlLogin = ApisEnum.BaseLogin

export interface IUserList {
  id: string
  name: string
  slug: string
  description: string | null
  users_count: number
}

export const useServiceIndexUserLists = (params: { page?: number; limit?: number; search?: string }) => {
  return useGET<{ status: string; message: string | null; data: IUserList[] }>({
    url,
    customHost: urlLogin,
    filters: params
  })
}
