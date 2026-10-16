import { ApisEnum } from '@/configs/apisEnum'
import { useGET } from '@/hooks/useApi'
import { IPaginate } from '@/interfaces/IPaginate'
import { IEmail } from '@/services/messages/interfaces/IEmail'

const url = '/api/v1/emails'

export const useServiceIndexEmails = (params: Record<string, unknown> = {}) => {
  return useGET<IPaginate<IEmail>>({ url, filters: params, customHost: ApisEnum.BaseMessages })
}
