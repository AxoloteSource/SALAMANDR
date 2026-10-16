import { ApisEnum } from '@/configs/apisEnum'
import { useDELETE, useGET, usePOST, usePUT } from '@/hooks/useApi'
import { IPaginate } from '@/interfaces/IPaginate'
import { IPushNotification } from '@/services/messages/interfaces/IPushNotification'

const url = '/api/v1/push-notifications'

export const useServiceIndexPushNotifications = (params: Record<string, unknown> = {}) => {
  return useGET<IPaginate<IPushNotification>>({ url, filters: params, customHost: ApisEnum.BaseMessages })
}

export const useServiceShowPushNotification = () => {
  return useGET<IPushNotification>({ url, customHost: ApisEnum.BaseMessages })
}

export const useServiceStorePushNotification = () => {
  return usePOST<IPushNotification>({ url, customHost: ApisEnum.BaseMessages })
}

export const useServiceUpdatePushNotification = (id: string) => {
  return usePUT<IPushNotification>({ url: `${url}/${id}`, customHost: ApisEnum.BaseMessages })
}

export const useServiceDeletePushNotification = (id: string) => {
  return useDELETE({ url: `${url}/${id}`, customHost: ApisEnum.BaseMessages })
}
