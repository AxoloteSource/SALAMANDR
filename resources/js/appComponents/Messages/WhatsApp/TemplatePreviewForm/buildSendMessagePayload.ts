import { IWhatsAppTemplate } from '@/services/messages/interfaces/IWhatsAppTemplate'
import { ITemplatePreviewFormValues } from './interfaces/ITemplatePreviewFormProps'

export const buildSendMessagePayload = (values: ITemplatePreviewFormValues, template: IWhatsAppTemplate): Record<string, unknown> => {
  const phoneNumber = values.phone_code ? `${values.phone_code}${values.phone_number}` : values.phone_number

  return {
    ...values,
    phone_number: phoneNumber,
    template_name: template.name,
    language: template.language
  }
}
