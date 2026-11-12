import { ApisEnum } from '@/configs/apisEnum'
import { axiosDELETE, axiosPOST, useGET, usePOST } from '@/hooks/useApi'
import { useAxios } from '@/hooks/useAxios'
import { IPaginate } from '@/interfaces/IPaginate'
import { IPaginateServiceProps } from '@/interfaces/IPaginateServiceProps'
import { IPersonalAccessToken, IPersonalAccessTokenCreated } from '@/interfaces/models/PersonalAccessToken/IPersonalAccessToken'
import { useMutation } from '@tanstack/react-query'

const url = '/api/v1/personal-access-tokens'
const urlLogin = ApisEnum.BaseLogin

interface IIndexPersonalAccessTokensProps extends IPaginateServiceProps {
  user_id?: string
  order_by?: string
  order?: string
}

export const useServiceIndexPersonalAccessTokens = ({
  user_id = '',
  filters = [],
  search = null,
  page = 1,
  limit = 10,
  order_by = 'created_at',
  order = 'desc'
}: IIndexPersonalAccessTokensProps) => {
  return useGET<IPaginate<IPersonalAccessToken>>({
    url,
    customHost: urlLogin,
    filters: {
      user_id,
      filters,
      search,
      page,
      limit,
      order_by,
      order
    }
  })
}

export const useServiceStorePersonalAccessToken = () => usePOST<IPersonalAccessTokenCreated>({ url, customHost: urlLogin })

export const useServiceRevokePersonalAccessToken = () => {
  const { axiosApi } = useAxios()

  return useMutation({
    mutationFn: (id: string) => axiosPOST(axiosApi, { url: `${url}/${id}/revoke`, customHost: urlLogin })
  })
}

export const useServiceDeletePersonalAccessToken = () => {
  const { axiosApi } = useAxios()

  return useMutation({
    mutationFn: (id: string) => axiosDELETE(axiosApi, { url: `${url}/${id}`, customHost: urlLogin })
  })
}
