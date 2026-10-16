import { ApisEnum } from '@/configs/apisEnum'
import { usePOST } from '@/hooks/useApi'

const url = '/api/v1/messages/whatsapp/send'

export const useServiceSendWhatsAppMessage = () => {
  return usePOST({ customHost: ApisEnum.BaseMessages,  url })
}
