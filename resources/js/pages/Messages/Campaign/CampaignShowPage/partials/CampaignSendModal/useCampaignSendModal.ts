import { useWhatsAppTemplatePreview } from '@/appComponents/Messages/WhatsApp/WhatsAppTemplatePreview/useWhatsAppTemplatePreview'
import { IWhatsAppTemplate } from '@/services/messages/interfaces/IWhatsAppTemplate'

interface UseCampaignSendModalProps {
  template: IWhatsAppTemplate
  onSend: (params: Array<{ key: string; value: string; type: string }>) => void
}

export const useCampaignSendModal = ({ template, onSend }: UseCampaignSendModalProps) => {
  const preview = useWhatsAppTemplatePreview(template)

  return {
    ...preview,
    buttons: preview.buttons,
    onSend
  }
}
