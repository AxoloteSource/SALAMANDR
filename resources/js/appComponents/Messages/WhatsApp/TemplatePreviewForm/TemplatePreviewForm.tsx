import Button from '@axolotesource/ui/components/Buttons'
import { ButtonTypeEnum } from '@axolotesource/ui/components/Buttons/enums/buttonType.enum'
import { ButtonVariantEnum } from '@axolotesource/ui/components/Buttons/enums/buttonVariant.enum'
import { Input } from '@axolotesource/ui/components/Form/Input'
import InputPhoneNumber from '@axolotesource/ui/components/Form/Input/InputPhoneNumber'
import { Form, Formik } from 'formik'
import { ITemplatePreviewFormProps, ITemplatePreviewFormValues } from './interfaces/ITemplatePreviewFormProps'
import { useTemplatePreviewForm } from './useTemplatePreviewForm'

export const TemplatePreviewForm = ({
  variables,
  buttons = [],
  showPhoneNumber = false,
  isSubmitting = false,
  formikRef,
  onSubmit,
  onCancel,
  submitLabel = 'Send',
  cancelLabel = 'Cancel'
}: ITemplatePreviewFormProps) => {
  const { initialValues, validationSchema, handleSubmit } = useTemplatePreviewForm({
    variables,
    buttons,
    showPhoneNumber,
    onSubmit
  })

  return (
    <Formik
      innerRef={(instance) => {
        if (formikRef) {
          formikRef.current = instance
        }
      }}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {(formik) => (
        <Form className="mt-4 flex flex-col gap-3">
          {showPhoneNumber && <InputPhoneNumber name="phone_number" nameCode="phone_code" formik={formik} />}

          {variables.map((variable, index) => (
            <Input key={variable.id} label={variable.name} name={`params.${index}.value` as keyof ITemplatePreviewFormValues} formik={formik} />
          ))}

          {buttons.map((button, index) => (
            <Input
              key={button.text}
              label={`Botón (${button.type === 'URL' ? 'URL' : 'Respuesta rápida'}): ${button.text}`}
              name={`buttons.${index}.value` as keyof ITemplatePreviewFormValues}
              formik={formik}
            />
          ))}

          <div className="flex gap-2">
            <Button type={ButtonTypeEnum.Submit} variant={ButtonVariantEnum.Solid} loading={isSubmitting}>
              {submitLabel}
            </Button>
            {onCancel && (
              <Button type={ButtonTypeEnum.Button} variant={ButtonVariantEnum.Outline} onClick={onCancel}>
                {cancelLabel}
              </Button>
            )}
          </div>
        </Form>
      )}
    </Formik>
  )
}
