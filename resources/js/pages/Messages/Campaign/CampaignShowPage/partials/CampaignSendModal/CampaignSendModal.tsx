import { TemplatePreviewForm } from '@/appComponents/Messages/WhatsApp/TemplatePreviewForm/TemplatePreviewForm'
import { WhatsAppTemplatePreview } from '@/appComponents/Messages/WhatsApp/WhatsAppTemplatePreview/WhatsAppTemplatePreview'
import { IWhatsAppTemplate } from '@/services/messages/interfaces/IWhatsAppTemplate'
import Modal from '@axolotesource/ui/components/Modal/Modal'
import { useTranslation } from 'react-i18next'
import { useCampaignSendModal } from './useCampaignSendModal'

interface CampaignSendModalProps {
  isOpen: boolean
  close: () => void
  template: IWhatsAppTemplate
  onSend: (params: Array<{ key: string; value: string; type: string }>) => void
  isSending: boolean
}

export const CampaignSendModal = ({ isOpen, close, template, onSend, isSending }: CampaignSendModalProps) => {
  const { t } = useTranslation()
  const { variables, buttons } = useCampaignSendModal({ template, onSend })

  return (
    <Modal title={t('send_campaign')} isOpen={isOpen} close={close} className="max-w-2xl">
      <WhatsAppTemplatePreview template={template} />

      <TemplatePreviewForm
        variables={variables}
        buttons={buttons}
        showPhoneNumber={false}
        isSubmitting={isSending}
        onSubmit={(values) => {
          const params = [
            ...values.params.map((p) => ({
              key: p.key,
              value: p.value,
              type: 'text'
            })),
            ...values.buttons.map((b) => ({
              key: b.key,
              value: b.value,
              type: 'button'
            }))
          ]
          onSend(params)
        }}
        onCancel={close}
        submitLabel={t('send_campaign')}
        cancelLabel={t('cancel')}
      />
    </Modal>
  )
}
