import { ApisEnum } from '@/configs/apisEnum'
import { usePOST } from '@/hooks/useApi'

const url = '/api/v1/messages/push-notifications/send'

export const useServiceSendPushNotification = () => {
  return usePOST({ customHost: ApisEnum.BaseMessages, url })
}
