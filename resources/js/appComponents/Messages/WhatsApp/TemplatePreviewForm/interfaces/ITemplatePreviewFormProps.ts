import { IWhatsAppTemplateButton, IWhatsAppTemplateVariable } from '@/services/messages/interfaces/IWhatsAppTemplate'
import { FormikProps } from 'formik'

export interface ITemplatePreviewFormProps {
  variables: IWhatsAppTemplateVariable[]
  buttons?: IWhatsAppTemplateButton[]
  showPhoneNumber?: boolean
  isSubmitting?: boolean
  formikRef?: React.RefObject<FormikProps<ITemplatePreviewFormValues> | null>
  onSubmit: (values: ITemplatePreviewFormValues) => void
  onCancel?: () => void
  submitLabel?: string
  cancelLabel?: string
}

export interface ITemplatePreviewFormValues {
  phone_code?: string
  phone_number?: string
  params: Array<{
    key: string
    value: string
  }>
  buttons: Array<{
    key: string
    value: string
    type: string
  }>
}
