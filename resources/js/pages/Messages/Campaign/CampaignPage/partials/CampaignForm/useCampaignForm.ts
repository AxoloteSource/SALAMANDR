import { ChannelEnum } from '@/services/messages/enums/ChannelEnum'
import { useOnSubmit } from '@/hooks/useOnSubmit'
import { useServiceStoreCampaign, useServiceUpdateCampaign } from '@/services/messages/campaigns/useServiceCampaign'
import { useServiceIndexChannels } from '@/services/messages/channels/useServiceChannel'
import { useServiceIndexWhatsAppTemplates } from '@/services/messages/whatsapp-template/useServiceWhatsAppTemplate'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

interface ICampaignFormValues {
  name: string
  channel_id: number | null
  whatsapp_template_id: string | null
  file: File | null
}

export const useCampaignForm = ({ selectedItem, onSuccess }: { selectedItem: Record<string, unknown> | null; onSuccess: () => void }) => {
  const { t } = useTranslation()
  const { mutateAsync: storeMutateAsync } = useServiceStoreCampaign()
  const { mutateAsync: updateMutateAsync } = useServiceUpdateCampaign(String(selectedItem?.id ?? ''))

  const mutateAsync = selectedItem ? updateMutateAsync : storeMutateAsync

  const { data: channelsData, isLoading: isLoadingChannels } = useServiceIndexChannels()
  const { data: templatesData, isLoading: isLoadingTemplates } = useServiceIndexWhatsAppTemplates()

  const channelOptions = (channelsData?.data ?? []).map((channel) => ({
    value: channel.id,
    label: channel.name
  }))

  const templateOptions = (templatesData?.data ?? []).map((template) => ({
    value: template.id,
    label: template.name
  }))

  const { onSubmit } = useOnSubmit({
    mutateAsync,
    onSuccess,
    formatData: (data: ICampaignFormValues) => {
      const formData = new FormData()
      formData.append('name', data.name ?? '')
      formData.append('channel_id', String(data.channel_id ?? 0))
      if (data.whatsapp_template_id) {
        formData.append('whatsapp_template_id', data.whatsapp_template_id)
      }
      if (data.file) {
        formData.append('file', data.file)
      }
      return formData as unknown as ICampaignFormValues
    }
  })

  const initialValues: ICampaignFormValues = {
    name: (selectedItem?.name as string) ?? '',
    channel_id: (selectedItem?.channel_id as number) ?? null,
    whatsapp_template_id: (selectedItem?.whatsapp_template_id as string) ?? null,
    file: null
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('name_is_required')),
    channel_id: Yup.number().nullable().required(t('channel_is_required')),
    whatsapp_template_id: Yup.string().nullable(),
    file: Yup.mixed().when('channel_id', {
      is: ChannelEnum.Whatsapp,
      then: (schema) => schema.required(t('file_is_required')),
      otherwise: (schema) => schema.nullable()
    })
  })

  return { initialValues, validationSchema, onSubmit, channelOptions, templateOptions, isLoadingChannels, isLoadingTemplates }
}
