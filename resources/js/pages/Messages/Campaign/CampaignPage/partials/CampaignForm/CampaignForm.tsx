import Button from '@axolotesource/ui/components/Buttons/Button'
import { ButtonTypeEnum } from '@axolotesource/ui/components/Buttons/enums/buttonType.enum'
import DragDopFileFormik from '@axolotesource/ui/components/Form/DargDropFile/DragDopFileFormik'
import Input from '@axolotesource/ui/components/Form/Input/Input'
import InputSelect from '@axolotesource/ui/components/Form/Select/Select'
import Modal from '@axolotesource/ui/components/Modal/Modal'
import { ChannelEnum } from '@/services/messages/enums/ChannelEnum'
import { Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useCampaignForm } from './useCampaignForm'

interface Props {
  isOpen: boolean
  close: () => void
  selectedItem: Record<string, unknown> | null
  onSuccess: () => void
}

export const CampaignForm = ({ isOpen, close, selectedItem, onSuccess }: Props) => {
  const { t } = useTranslation()
  const { initialValues, validationSchema, onSubmit, channelOptions, templateOptions, isLoadingChannels, isLoadingTemplates } = useCampaignForm({
    selectedItem,
    onSuccess
  })

  return (
    <Modal isOpen={isOpen} close={close} title={selectedItem ? t('edit_campaign') : t('new_campaign')} className="w-full max-w-2xl">
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {(formik) => (
          <Form>
            <div className="space-y-4">
              <Input name="name" label={t('name')} formik={formik} placeholder={t('name')} />
              <InputSelect
                name="channel_id"
                label={t('channel')}
                formik={formik}
                options={channelOptions}
                isLoading={isLoadingChannels}
                isClearable={false}
                onChange={() => formik.setFieldValue('whatsapp_template_id', null)}
              />
              {formik.values.channel_id === ChannelEnum.Whatsapp && (
                <>
                  <InputSelect
                    name="whatsapp_template_id"
                    label={t('whatsapp_template')}
                    formik={formik}
                    options={templateOptions}
                    isLoading={isLoadingTemplates}
                    isClearable
                  />
                  <DragDopFileFormik name="file" formik={formik} multiple={false} isLoading={false} accept={{ 'text/csv': ['.csv'] }} />
                </>
              )}
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
