import { useServiceShowWhatsAppTemplate } from '@/services/messages/whatsapp-template/useServiceShowWhatsAppTemplate'
import { useParams } from 'react-router-dom'

export const useWhatsAppTemplateShowPage = () => {
  const { id } = useParams<{ id: string }>()

  const { data: template, isLoading } = useServiceShowWhatsAppTemplate(id ?? '')

  const breadCrumblesItems = [{ children: 'whatsapp_templates', to: '/whatsapp-templates' }, { children: template?.name ?? '...' }]

  return {
    template,
    isLoading,
    breadCrumblesItems
  }
}
