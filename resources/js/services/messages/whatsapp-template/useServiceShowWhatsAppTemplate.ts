import { ApisEnum } from '@/configs/apisEnum'
import { useGET } from '@/hooks/useApi'
import { IWhatsAppTemplate } from '@/services/messages/interfaces/IWhatsAppTemplate'

const url = '/api/v1/whatsapp/templates'

export const useServiceShowWhatsAppTemplate = (id: string) => {
  return useGET<IWhatsAppTemplate>({ customHost: ApisEnum.BaseMessages, url: `${url}/${id}` })
}
