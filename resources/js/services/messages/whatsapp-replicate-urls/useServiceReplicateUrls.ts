import { ApisEnum } from '@/configs/apisEnum'
import { axiosApi } from '@/configs/axiosConfig'
import { useDELETE, useGET, usePOST, usePUT } from '@/hooks/useApi'
import { IPaginate } from '@/interfaces/IPaginate'
import { useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { IReplicateUrl } from './interfaces/IReplicateUrl'

/**
 * WhatsApp webhook replicate URLs CRUD (HAG-35 / HAG-33 contract).
 * Base `/api/v1/whatsapp/replicate-urls`, customHost BaseMessages.
 *   GET     -> 206 datatable, item { id, url, is_active, created_at, updated_at }
 *   POST    -> 201, body { url, is_active? }
 *   PUT     /{id} -> 200, body { url, is_active? }
 *   DELETE  /{id} -> 204
 *   PATCH   /{id}/toggle -> 200 (flips is_active)
 */
const url = '/api/v1/whatsapp/replicate-urls'

export const useServiceIndexReplicateUrls = (params: Record<string, unknown> = {}) =>
  useGET<IPaginate<IReplicateUrl>>({ url, filters: params, customHost: ApisEnum.BaseMessages })

export const useServiceStoreReplicateUrl = () => usePOST<IReplicateUrl>({ url, customHost: ApisEnum.BaseMessages })

export const useServiceUpdateReplicateUrl = (id: string) => usePUT<IReplicateUrl>({ url: `${url}/${id}`, customHost: ApisEnum.BaseMessages })

export const useServiceDeleteReplicateUrl = (id: string) => useDELETE({ url: `${url}/${id}`, customHost: ApisEnum.BaseMessages })

export const useServiceToggleReplicateUrl = () =>
  useMutation<AxiosResponse, Error, string | number>({
    mutationFn: (id) => axiosApi.patch(`${ApisEnum.BaseMessages}${url}/${id}/toggle`)
  })
