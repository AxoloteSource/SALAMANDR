import * as Yup from 'yup'
import { ITemplatePreviewFormProps, ITemplatePreviewFormValues } from './interfaces/ITemplatePreviewFormProps'

export const useTemplatePreviewForm = ({ variables, buttons = [], showPhoneNumber = false, onSubmit }: ITemplatePreviewFormProps) => {
  const initialValues: ITemplatePreviewFormValues = {
    ...(showPhoneNumber && {
      phone_code: '52',
      phone_number: ''
    }),
    params: variables.map((v) => ({
      key: v.name,
      value: v.example_value ?? ''
    })),
    buttons: buttons.map((b) => ({
      key: b.text,
      value: b.type === 'URL' ? '' : (b.example?.[0] ?? ''),
      type: b.type
    }))
  }

  const validationSchema = Yup.object().shape({
    ...(showPhoneNumber && {
      phone_code: Yup.string().required('Phone code is required'),
      phone_number: Yup.string().required('Phone number is required')
    }),
    params: Yup.array().of(
      Yup.object().shape({
        key: Yup.string().required('Key is required'),
        value: Yup.string().required('Value is required')
      })
    ),
    buttons: Yup.array().of(
      Yup.object().shape({
        key: Yup.string().required('Key is required'),
        value: Yup.string().required('Value is required')
      })
    )
  })

  const handleSubmit = (values: ITemplatePreviewFormValues) => {
    onSubmit(values)
  }

  return {
    initialValues,
    validationSchema,
    handleSubmit
  }
}
