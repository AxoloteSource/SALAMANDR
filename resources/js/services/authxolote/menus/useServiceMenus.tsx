import { ApisEnum } from '@/configs/apisEnum'
import { axiosDELETE, useGET, usePOST, usePUT } from '@/hooks/useApi'
import { useAxios } from '@/hooks/useAxios'
import { useMutation } from '@tanstack/react-query'
import { IPaginate } from '@/interfaces/IPaginate'
import { IPaginateServiceProps } from '@/interfaces/IPaginateServiceProps'
import { IMenu } from '@/interfaces/models/Menu/IMenu'
import { IMenuShow } from '@/interfaces/models/Menu/IMenuShow'

const url = '/api/v1/menus'
const urlLogin = ApisEnum.BaseLogin

export const useServiceIndexMenus = ({ filters = [], search = null, page = 1, limit = 10 }: IPaginateServiceProps) => {
  return useGET<IPaginate<IMenu>>({
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

export const useServiceShowMenu = (slug: string, enabled = true) => useGET<IMenuShow>({ url: `${url}/${slug}`, customHost: urlLogin, enabled })

export const useServiceShowAllMenu = (slug: string, enabled = true, roleId?: string | null) =>
  useGET<IMenuShow>({
    url: `${url}/${slug}/all-items`,
    customHost: urlLogin,
    enabled,
    filters: roleId ? { role_id: roleId } : {}
  })

export const useServiceStoreMenu = () => usePOST<IMenu>({ url, customHost: urlLogin })
export const useServiceUpdateMenu = (id: string) => usePUT<IMenu>({ url: `${url}/${id}`, customHost: urlLogin })
export const useServiceDeleteMenu = () => {
  const { axiosApi } = useAxios()

  return useMutation({
    mutationFn: (id: string) => axiosDELETE(axiosApi, { url: `${url}/${id}` })
  })
}
