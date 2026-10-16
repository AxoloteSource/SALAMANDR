import { useOnSubmit } from '@/hooks/useOnSubmit'
import { useServiceStoreReplicateUrl, useServiceUpdateReplicateUrl } from '@/services/messages/whatsapp-replicate-urls/useServiceReplicateUrls'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

export interface IWebhookFormValues {
  url: string
  is_active: boolean
}

export const useWebhookForm = ({ selectedItem, onSuccess }: { selectedItem: Record<string, unknown> | null; onSuccess: () => void }) => {
  const { t } = useTranslation()
  const { mutateAsync: storeMutateAsync } = useServiceStoreReplicateUrl()
  const { mutateAsync: updateMutateAsync } = useServiceUpdateReplicateUrl(String(selectedItem?.id ?? ''))
  const mutateAsync = selectedItem ? updateMutateAsync : storeMutateAsync

  const { onSubmit } = useOnSubmit<IWebhookFormValues>({
    mutateAsync,
    onSuccess: () => onSuccess()
  })

  const initialValues: IWebhookFormValues = {
    url: (selectedItem?.url as string) ?? '',
    is_active: (selectedItem?.is_active as boolean) ?? true
  }

  const validationSchema = Yup.object().shape({
    url: Yup.string().trim().url(t('invalid_url')).required(t('url_is_required')),
    is_active: Yup.boolean()
  })

  return { initialValues, validationSchema, onSubmit }
}
