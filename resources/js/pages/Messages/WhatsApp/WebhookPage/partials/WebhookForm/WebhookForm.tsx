import Button from '@axolotesource/ui/components/Buttons/Button'
import { ButtonTypeEnum } from '@axolotesource/ui/components/Buttons/enums/buttonType.enum'
import Input from '@axolotesource/ui/components/Form/Input/Input'
import Switch from '@axolotesource/ui/components/Form/Switch'
import Modal from '@axolotesource/ui/components/Modal/Modal'
import { Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useWebhookForm } from './useWebhookForm'

interface Props {
  isOpen: boolean
  close: () => void
  selectedItem: Record<string, unknown> | null
  onSuccess: () => void
}

export const WebhookForm = ({ isOpen, close, selectedItem, onSuccess }: Props) => {
  const { t } = useTranslation()
  const { initialValues, validationSchema, onSubmit } = useWebhookForm({ selectedItem, onSuccess })

  return (
    <Modal isOpen={isOpen} close={close} title={selectedItem ? t('edit_webhook_url') : t('new_webhook_url')} className="w-full max-w-xl">
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
        {(formik) => (
          <Form>
            <div className="space-y-4">
              <Input name="url" label={t('webhook_url')} formik={formik} placeholder="https://example.com/webhook" />
              <Switch name="is_active" label={t('active')} formik={formik} />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button type={ButtonTypeEnum.Button} onClick={close}>
                {t('cancel')}
              </Button>
              <Button type={ButtonTypeEnum.Submit} loading={formik.isSubmitting}>
                {t(selectedItem ? 'update' : 'save')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default WebhookForm
