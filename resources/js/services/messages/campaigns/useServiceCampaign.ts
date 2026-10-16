import { ApisEnum } from '@/configs/apisEnum'
import { useDELETE, useGET, usePOST, usePUT } from '@/hooks/useApi'
import { IPaginate } from '@/interfaces/IPaginate'
import { ICampaign } from '@/services/messages/interfaces/ICampaign'
import { IPhone } from '@/services/messages/interfaces/IPhone'

const url = '/api/v1/campaigns'

export const useServiceIndexCampaigns = (params: Record<string, unknown> = {}) => {
  return useGET<IPaginate<ICampaign>>({ url, filters: params, customHost: ApisEnum.BaseMessages })
}

export const useServiceShowCampaign = (id: string) => {
  return useGET<ICampaign>({ url: `${url}/${id}`, customHost: ApisEnum.BaseMessages })
}

export const useServiceStoreCampaign = () => {
  return usePOST<ICampaign>({ url, isFile: true, customHost: ApisEnum.BaseMessages })
}

export const useServiceUpdateCampaign = (id: string) => {
  return usePUT<ICampaign>({ url: `${url}/${id}`, customHost: ApisEnum.BaseMessages })
}

export const useServiceDeleteCampaign = (id: string) => {
  return useDELETE({ url: `${url}/${id}`, customHost: ApisEnum.BaseMessages })
}

export const useServiceCampaignPhones = (params: Record<string, unknown> = {}) => {
  const { id, ...filters } = params
  return useGET<IPaginate<IPhone>>({ url: `${url}/${id}/phones`, filters, customHost: ApisEnum.BaseMessages })
}

export const useServiceSendCampaign = (id: string) => {
  return usePOST({ url: `${url}/${id}/send`, customHost: ApisEnum.BaseMessages })
}
