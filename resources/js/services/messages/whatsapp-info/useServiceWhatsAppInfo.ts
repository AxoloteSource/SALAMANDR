import { ApisEnum } from '@/configs/apisEnum'
import { useGET } from '@/hooks/useApi'
import { IWhatsAppInfo } from '@/services/messages/interfaces/IWhatsAppInfo'

const url = '/api/v1/whatsapp/info'

export const useServiceWhatsAppInfo = () => {
  return useGET<IWhatsAppInfo>({ customHost: ApisEnum.BaseMessages, url, nameQuery: 'whatsapp-info' })
}
