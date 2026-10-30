import { ApisEnum } from '@/configs/apisEnum'
import { useDELETE, useGET, usePOST, usePUT } from '@/hooks/useApi'
import { IPaginate } from '@/interfaces/IPaginate'
import { IProvider } from './interfaces/IProvider'

const url = '/api/v1/providers'

export const useServiceIndexProviders = (params: Record<string, unknown> = {}) =>
  useGET<IPaginate<IProvider>>({ url, filters: params, customHost: ApisEnum.BaseMessages })

export const useServiceShowProvider = (id: string) => useGET<IProvider>({ url: `${url}/${id}`, customHost: ApisEnum.BaseMessages })

export const useServiceStoreProvider = () => usePOST<IProvider>({ url, customHost: ApisEnum.BaseMessages })

export const useServiceUpdateProvider = (id: string) => usePUT<IProvider>({ url: `${url}/${id}`, customHost: ApisEnum.BaseMessages })

export const useServiceDeleteProvider = (id: string) => useDELETE({ url: `${url}/${id}`, customHost: ApisEnum.BaseMessages })
