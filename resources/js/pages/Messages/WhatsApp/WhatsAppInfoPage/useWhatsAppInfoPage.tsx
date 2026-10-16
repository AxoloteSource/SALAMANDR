import { useServiceWhatsAppInfo } from '@/services/messages/whatsapp-info/useServiceWhatsAppInfo'

export const useWhatsAppInfoPage = () => {
  const { data, isLoading } = useServiceWhatsAppInfo()

  const info = data

  const breadCrumblesItems = [{ children: 'whatsapp_templates', to: '/whatsapp-templates' }, { children: 'whatsapp_info' }]

  return {
    info,
    isLoading,
    breadCrumblesItems
  }
}
