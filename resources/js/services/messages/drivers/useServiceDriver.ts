import { ApisEnum } from '@/configs/apisEnum'
import { useDELETE, useGET, usePOST, usePUT } from '@/hooks/useApi'
import { IPaginate } from '@/interfaces/IPaginate'
import { IDriver } from './interfaces/IDriver'

const url = '/api/v1/drivers'

export const useServiceIndexDrivers = (params: Record<string, unknown> = {}) =>
  useGET<IPaginate<IDriver>>({ url, filters: params, customHost: ApisEnum.BaseMessages })

export const useServiceShowDriver = (id: string | number) => useGET<IDriver>({ url: `${url}/${id}`, customHost: ApisEnum.BaseMessages })

export const useServiceStoreDriver = () => usePOST<IDriver>({ url, customHost: ApisEnum.BaseMessages })

export const useServiceUpdateDriver = (id: string | number) => usePUT<IDriver>({ url: `${url}/${id}`, customHost: ApisEnum.BaseMessages })

export const useServiceDeleteDriver = (id: string | number) => useDELETE({ url: `${url}/${id}`, customHost: ApisEnum.BaseMessages })
