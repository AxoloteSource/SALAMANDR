import { buildSendMessagePayload } from '@/appComponents/Messages/WhatsApp/TemplatePreviewForm/buildSendMessagePayload'
import { TemplatePreviewForm } from '@/appComponents/Messages/WhatsApp/TemplatePreviewForm/TemplatePreviewForm'
import { WhatsAppTemplatePreview } from '@/appComponents/Messages/WhatsApp/WhatsAppTemplatePreview/WhatsAppTemplatePreview'
import { IWhatsAppTemplate } from '@/services/messages/interfaces/IWhatsAppTemplate'
import Button from '@axolotesource/ui/components/Buttons'
import { ButtonVariantEnum } from '@axolotesource/ui/components/Buttons/enums/buttonVariant.enum'
import Card from '@axolotesource/ui/components/Card'
import CardTitle from '@axolotesource/ui/components/Card/partials/CardTitle'
import { CodeBlock } from '@axolotesource/ui/components/CodeBlock/CodeBlock'
import Modal from '@axolotesource/ui/components/Modal/Modal'
import { useModal } from '@axolotesource/ui/hooks/useModal'
import { Code2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTemplatePreviewCard } from './useTemplatePreviewCard'

interface Props {
  template: IWhatsAppTemplate
}

export const TemplatePreviewCard = ({ template }: Props) => {
  const { t } = useTranslation()
  const { isOpen: codeModalIsOpen, open: openCodeModal, close: closeCodeModal } = useModal(false)
  const [codeExample, setCodeExample] = useState<string | null>(null)
  const { isTesting, successMessage, variables, buttons, formikRef, mutation, handleSend, handleStartTesting, handleCancelTesting } =
    useTemplatePreviewCard({
      template
    })

  const handleOpenCodeModal = () => {
    if (formikRef.current) {
      setCodeExample(JSON.stringify(buildSendMessagePayload(formikRef.current.values, template), null, 2))
    }
    openCodeModal()
  }

  return (
    <Card>
      <CardTitle
        actionButton={
          isTesting ? (
            <Button variant={ButtonVariantEnum.Solid} onClick={handleOpenCodeModal}>
              <Code2 className="mr-2 h-4 w-4" />
              {t('code')}
            </Button>
          ) : null
        }
      >
        {t('message_preview')}
      </CardTitle>
      <WhatsAppTemplatePreview template={template} />

      {!isTesting && (
        <div className="mt-4">
          <Button variant={ButtonVariantEnum.Outline} onClick={handleStartTesting}>
            {t('test')}
          </Button>
        </div>
      )}

      {isTesting && (
        <div className="mt-4 border-t pt-4">
          <TemplatePreviewForm
            variables={variables}
            buttons={buttons}
            showPhoneNumber={true}
            formikRef={formikRef}
            isSubmitting={mutation.isPending}
            onSubmit={handleSend}
            onCancel={handleCancelTesting}
            submitLabel={t('send')}
            cancelLabel={t('cancel')}
          />
        </div>
      )}

      {successMessage && <div className="mt-2 text-sm font-medium text-green-600">{successMessage}</div>}

      <Modal isOpen={codeModalIsOpen} close={closeCodeModal} title={t('api_request_example')} className="max-w-2xl">
        {codeExample && <CodeBlock language="json" theme="monokai-sublime" code={codeExample} />}
      </Modal>
    </Card>
  )
}
