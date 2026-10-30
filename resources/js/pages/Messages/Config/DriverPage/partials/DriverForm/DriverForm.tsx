import Button from '@axolotesource/ui/components/Buttons/Button'
import { ButtonTypeEnum } from '@axolotesource/ui/components/Buttons/enums/buttonType.enum'
import Input from '@axolotesource/ui/components/Form/Input/Input'
import Modal from '@axolotesource/ui/components/Modal/Modal'
import { Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useDriverForm } from './useDriverForm'

interface Props {
  isOpen: boolean
  close: () => void
  selectedItem: Record<string, unknown> | null
  onSuccess: () => void
}

export const DriverForm = ({ isOpen, close, selectedItem, onSuccess }: Props) => {
  const { t } = useTranslation()
  const { initialValues, validationSchema, onSubmit } = useDriverForm({ selectedItem, onSuccess })

  return (
    <Modal isOpen={isOpen} close={close} title={selectedItem ? t('edit_driver') : t('new_driver')} className="w-full max-w-xl">
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {(formik) => (
          <Form>
            <div className="space-y-4">
              <Input name="name" label={t('name')} formik={formik} placeholder={t('name')} />
              <Input name="config_key" label={t('config_key')} formik={formik} placeholder={t('config_key')} />
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
