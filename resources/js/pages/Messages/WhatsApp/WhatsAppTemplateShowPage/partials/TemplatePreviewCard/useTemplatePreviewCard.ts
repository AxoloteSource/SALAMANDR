import { buildSendMessagePayload } from '@/appComponents/Messages/WhatsApp/TemplatePreviewForm/buildSendMessagePayload'
import { ITemplatePreviewFormValues } from '@/appComponents/Messages/WhatsApp/TemplatePreviewForm/interfaces/ITemplatePreviewFormProps'
import { useWhatsAppTemplatePreview } from '@/appComponents/Messages/WhatsApp/WhatsAppTemplatePreview/useWhatsAppTemplatePreview'
import { IWhatsAppTemplate } from '@/services/messages/interfaces/IWhatsAppTemplate'
import { useServiceSendWhatsAppMessage } from '@/services/messages/messages/useServiceSendWhatsAppMessage'
import { FormikProps } from 'formik'
import { useRef, useState } from 'react'

interface UseTemplatePreviewCardProps {
  template: IWhatsAppTemplate
}

export const useTemplatePreviewCard = ({ template }: UseTemplatePreviewCardProps) => {
  const preview = useWhatsAppTemplatePreview(template)
  const [isTesting, setIsTesting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const formikRef = useRef<FormikProps<ITemplatePreviewFormValues>>(null)

  const mutation = useServiceSendWhatsAppMessage()

  const buttons = preview.buttons

  const handleSend = (values: ITemplatePreviewFormValues) => {
    return mutation.mutateAsync(buildSendMessagePayload(values, template))
  }

  const handleStartTesting = () => setIsTesting(true)
  const handleCancelTesting = () => setIsTesting(false)

  return {
    ...preview,
    buttons,
    formikRef,
    isTesting,
    successMessage,
    setSuccessMessage,
    mutation,
    handleSend,
    handleStartTesting,
    handleCancelTesting
  }
}
