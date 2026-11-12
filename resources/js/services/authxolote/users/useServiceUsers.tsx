import { ApisEnum } from '@/configs/apisEnum'
import { axiosDELETE, axiosPUT, useGET, usePOST } from '@/hooks/useApi'
import { useAxios } from '@/hooks/useAxios'
import { IPaginate } from '@/interfaces/IPaginate'
import { IPaginateServiceProps } from '@/interfaces/IPaginateServiceProps'
import { IUser } from '@/interfaces/models/User/user.interface'
import { useMutation } from '@tanstack/react-query'

const url = '/api/v1/users'
const urlLogin = ApisEnum.BaseLogin

export const useServiceIndexUsers = ({ filters = [], search = null, page = 1, limit = 10 }: IPaginateServiceProps) => {
  return useGET<IPaginate<IUser>>({
    url,
    customHost: urlLogin,
    filters: {
      filters,
      search,
      page,
      limit
    }
  })
}

export const useServiceIndexAppUsers = ({ search = null, page = 1, limit = 10 }: IPaginateServiceProps) => {
  return useGET<IPaginate<IUser>>({
    url,
    customHost: urlLogin,
    filters: {
      filters: [{ property: 'user_type', value: 'app' }],
      search,
      page,
      limit
    }
  })
}

export const useServiceStoreUser = () => usePOST<IUser>({ url, customHost: urlLogin })

export const useServiceDeleteUser = () => {
  const { axiosApi } = useAxios()

  return useMutation({
    mutationFn: (id: string) => axiosDELETE(axiosApi, { url: `${url}/${id}`, customHost: urlLogin })
  })
}

export const useServiceBanUser = () => {
  const { axiosApi } = useAxios()

  return useMutation({
    mutationFn: (id: string) => axiosPUT(axiosApi, { url: `${url}/${id}/ban`, customHost: urlLogin })
  })
}
