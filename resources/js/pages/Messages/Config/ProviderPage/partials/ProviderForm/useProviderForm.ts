import { useOnSubmit } from '@/hooks/useOnSubmit'
import { useServiceIndexChannels } from '@/services/messages/channels/useServiceChannel'
import { IProviderConfig } from '@/services/messages/providers/interfaces/IProvider'
import { useServiceStoreProvider, useServiceUpdateProvider } from '@/services/messages/providers/useServiceProvider'
import { useServiceIndexDrivers } from '@/services/messages/drivers/useServiceDriver'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

interface IProviderFormValues {
  name: string
  active: boolean
  channel_ids: number[]
  provider_config_name: string
  driver_id: number | null
  provider_config_active: boolean
  provider_config_default: boolean
  config_json: string
}

interface IProviderPayload {
  name: string
  active: boolean
  channel_ids: number[]
  provider_config: {
    name: string
    driver_id: number
    active: boolean
    default: boolean
    config: Record<string, unknown>
  }
}

export const useProviderForm = ({ selectedItem, onSuccess }: { selectedItem: Record<string, unknown> | null; onSuccess: () => void }) => {
  const { t } = useTranslation()
  const { mutateAsync: storeMutateAsync } = useServiceStoreProvider()
  const { mutateAsync: updateMutateAsync } = useServiceUpdateProvider(String(selectedItem?.id ?? ''))

  const mutateAsync = selectedItem ? updateMutateAsync : storeMutateAsync

  const { data: channelsData, isLoading: isLoadingChannels } = useServiceIndexChannels()
  const { data: driversData, isLoading: isLoadingDrivers } = useServiceIndexDrivers({ limit: 100 })

  const channelOptions = (channelsData?.data ?? []).map((channel) => ({
    value: channel.id,
    label: channel.name
  }))

  const driverOptions = (driversData?.data ?? []).map((driver) => ({
    value: driver.id,
    label: driver.name
  }))

  const { onSubmit } = useOnSubmit<IProviderFormValues, unknown, IProviderPayload>({
    mutateAsync,
    onSuccess,
    formatData: (data) => ({
      name: data.name,
      active: data.active,
      channel_ids: data.channel_ids,
      provider_config: {
        name: data.provider_config_name,
        driver_id: Number(data.driver_id),
        active: data.provider_config_active,
        default: data.provider_config_default,
        config: JSON.parse(data.config_json || '{}')
      }
    })
  })

  const providerConfig = selectedItem?.provider_config as IProviderConfig | null | undefined
  const selectedChannels = (selectedItem?.channels as { id: number }[] | undefined) ?? []

  const initialValues: IProviderFormValues = {
    name: (selectedItem?.name as string) ?? '',
    active: (selectedItem?.active as boolean) ?? true,
    channel_ids: selectedChannels.map((channel) => channel.id),
    provider_config_name: providerConfig?.name ?? '',
    driver_id: providerConfig?.driver_id ?? null,
    provider_config_active: providerConfig?.active ?? true,
    provider_config_default: providerConfig?.default ?? false,
    config_json: providerConfig?.config ? JSON.stringify(providerConfig.config, null, 2) : '{\n  \n}'
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required(t('name_is_required')).max(50),
    active: Yup.boolean(),
    channel_ids: Yup.array().of(Yup.number()).min(1, t('channel_is_required')).required(t('channel_is_required')),
    provider_config_name: Yup.string().trim().required(t('provider_config_name_is_required')).max(50),
    driver_id: Yup.number().nullable().required(t('driver_is_required')),
    provider_config_active: Yup.boolean(),
    provider_config_default: Yup.boolean(),
    config_json: Yup.string()
      .required(t('config_is_required'))
      .test('valid-json', t('invalid_json'), (value) => {
        try {
          const parsed = JSON.parse(value || '{}')
          return parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)
        } catch {
          return false
        }
      })
  })

  return { initialValues, validationSchema, onSubmit, channelOptions, driverOptions, isLoadingChannels, isLoadingDrivers }
}
