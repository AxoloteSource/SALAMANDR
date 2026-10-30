import { useOnSubmit } from '@/hooks/useOnSubmit'
import { useServiceStoreDriver, useServiceUpdateDriver } from '@/services/messages/drivers/useServiceDriver'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

interface IDriverFormValues {
  name: string
  config_key: string
}

export const useDriverForm = ({ selectedItem, onSuccess }: { selectedItem: Record<string, unknown> | null; onSuccess: () => void }) => {
  const { t } = useTranslation()
  const { mutateAsync: storeMutateAsync } = useServiceStoreDriver()
  const { mutateAsync: updateMutateAsync } = useServiceUpdateDriver(String(selectedItem?.id ?? ''))

  const mutateAsync = selectedItem ? updateMutateAsync : storeMutateAsync

  const { onSubmit } = useOnSubmit({
    mutateAsync,
    onSuccess,
    formatData: (data: IDriverFormValues) => data
  })

  const initialValues: IDriverFormValues = {
    name: (selectedItem?.name as string) ?? '',
    config_key: (selectedItem?.config_key as string) ?? ''
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required(t('name_is_required')).max(255),
    config_key: Yup.string().trim().required(t('config_key_is_required')).max(255)
  })

  return { initialValues, validationSchema, onSubmit }
}
