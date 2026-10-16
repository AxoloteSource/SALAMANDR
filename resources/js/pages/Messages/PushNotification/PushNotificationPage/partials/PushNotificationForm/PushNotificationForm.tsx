import Button from '@axolotesource/ui/components/Buttons/Button'
import { ButtonTypeEnum } from '@axolotesource/ui/components/Buttons/enums/buttonType.enum'
import Input from '@axolotesource/ui/components/Form/Input/Input'
import Modal from '@axolotesource/ui/components/Modal/Modal'
import { Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import { usePushNotificationForm } from './usePushNotificationForm'

interface Props {
  isOpen: boolean
  close: () => void
  selectedItem: Record<string, unknown> | null
  onSuccess: () => void
}

export const PushNotificationForm = ({ isOpen, close, selectedItem, onSuccess }: Props) => {
  const { t } = useTranslation()
  const { initialValues, validationSchema, onSubmit } = usePushNotificationForm({ selectedItem, onSuccess })

  return (
    <Modal isOpen={isOpen} close={close} title={selectedItem ? t('edit_push_notification') : t('new_push_notification')} className="w-full max-w-2xl">
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {(formik) => (
          <Form>
            <div className="space-y-4">
              <Input name="title" label={t('title')} formik={formik} placeholder={t('title')} />
              <Input name="body" label={t('body')} formik={formik} as="textarea" rows={4} placeholder={t('body')} />
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
