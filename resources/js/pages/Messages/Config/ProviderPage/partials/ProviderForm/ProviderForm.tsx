import Button from '@axolotesource/ui/components/Buttons/Button'
import { ButtonTypeEnum } from '@axolotesource/ui/components/Buttons/enums/buttonType.enum'
import Input from '@axolotesource/ui/components/Form/Input/Input'
import InputSelect from '@axolotesource/ui/components/Form/Select/Select'
import Switch from '@axolotesource/ui/components/Form/Switch/Switch'
import Modal from '@axolotesource/ui/components/Modal/Modal'
import { Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useProviderForm } from './useProviderForm'

interface Props {
  isOpen: boolean
  close: () => void
  selectedItem: Record<string, unknown> | null
  onSuccess: () => void
}

export const ProviderForm = ({ isOpen, close, selectedItem, onSuccess }: Props) => {
  const { t } = useTranslation()
  const { initialValues, validationSchema, onSubmit, channelOptions, driverOptions, isLoadingChannels, isLoadingDrivers } = useProviderForm({
    selectedItem,
    onSuccess
  })

  return (
    <Modal isOpen={isOpen} close={close} title={selectedItem ? t('edit_provider') : t('new_provider')} className="w-full max-w-2xl">
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {(formik) => (
          <Form>
            <div className="space-y-4">
              <Input name="name" label={t('name')} formik={formik} placeholder={t('name')} />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Switch name="active" label={t('active')} formik={formik} />
              </div>

              <InputSelect
                name="channel_ids"
                label={t('channels')}
                formik={formik}
                options={channelOptions}
                isLoading={isLoadingChannels}
                isMulti
                isClearable={false}
              />

              <div className="border-t pt-4">
                <h3 className="mb-3 text-sm font-semibold">{t('provider_configuration')}</h3>

                <div className="space-y-4">
                  <Input name="provider_config_name" label={t('provider_config_name')} formik={formik} placeholder={t('provider_config_name')} />

                  <InputSelect
                    name="driver_id"
                    label={t('driver')}
                    formik={formik}
                    options={driverOptions}
                    isLoading={isLoadingDrivers}
                    isClearable={false}
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Switch name="provider_config_active" label={t('config_active')} formik={formik} />
                    <Switch name="provider_config_default" label={t('make_default')} formik={formik} />
                  </div>

                  <Input
                    name="config_json"
                    label={t('configuration')}
                    formik={formik}
                    as="textarea"
                    rows={8}
                    placeholder='{"key": "value"}'
                  />
                </div>
              </div>
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
