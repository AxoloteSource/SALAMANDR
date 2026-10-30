import { ApisEnum } from '@/configs/apisEnum'
import { usePOST } from '@/hooks/useApi'

const url = '/api/v1/whatsapp/templates/sync'

export const useServiceSyncWhatsAppTemplates = () => {
  return usePOST<{ synced: number }>({ customHost: ApisEnum.BaseMessages, url })
}
