import { ApisEnum } from '@/configs/apisEnum'
import { useGET } from '@/hooks/useApi'
import { IPaginate } from '@/interfaces/IPaginate'
import { IWhatsAppTemplate } from '@/services/messages/interfaces/IWhatsAppTemplate'

const url = '/api/v1/whatsapp/templates'

export const useServiceIndexWhatsAppTemplates = (params: Record<string, unknown> = {}) => {
  return useGET<IPaginate<IWhatsAppTemplate>>({ url, filters: params, customHost: ApisEnum.BaseMessages })
}
