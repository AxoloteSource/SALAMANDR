import { useOnSubmit } from '@/hooks/useOnSubmit'
import { useServiceStorePushNotification, useServiceUpdatePushNotification } from '@/services/messages/push-notifications/useServicePushNotification'
import * as Yup from 'yup'
import { ObjectSchema } from 'yup'

interface IPushNotificationFormValues {
  title: string
  body: string
}

export const usePushNotificationForm = ({ selectedItem, onSuccess }: { selectedItem: Record<string, unknown> | null; onSuccess: () => void }) => {
  const { mutateAsync: storeMutateAsync } = useServiceStorePushNotification()
  const { mutateAsync: updateMutateAsync } = useServiceUpdatePushNotification(String(selectedItem?.id ?? ''))

  const mutateAsync = selectedItem ? updateMutateAsync : storeMutateAsync

  const { onSubmit } = useOnSubmit({
    mutateAsync,
    onSuccess,
    formatData: (data: IPushNotificationFormValues) => data
  })

  const initialValues: IPushNotificationFormValues = {
    title: (selectedItem?.title as string) ?? '',
    body: (selectedItem?.body as string) ?? ''
  }

  const validationSchema: ObjectSchema<IPushNotificationFormValues> = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    body: Yup.string().required('Body is required')
  })

  return { initialValues, validationSchema, onSubmit }
}
