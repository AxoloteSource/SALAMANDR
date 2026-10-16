import { useServiceIndexUserLists, type IUserList } from '@/services/messages/authxolote/userLists/useServiceUserLists'
import { useServiceIndexDevices } from '@/services/messages/devices/useServiceDevice'
import { useServiceSendPushNotification } from '@/services/messages/push-notifications/useServiceSendPushNotification'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export type ActiveTab = 'userList' | 'devices'

export const useSendPushNotification = ({ pushNotificationId, onSuccess }: { pushNotificationId: string | null; onSuccess: () => void }) => {
  const { t } = useTranslation()
  const [selectedDevices, setSelectedDevices] = useState<{ value: string; label: string; user_id: string }[]>([])
  const [selectedUserListId, setSelectedUserListId] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  const { data: devicesData, isLoading: devicesLoading } = useServiceIndexDevices({ limit: 200 })
  const { data: userListsData, isLoading: userListsLoading } = useServiceIndexUserLists({})

  const { mutateAsync: sendPushNotification } = useServiceSendPushNotification()

  const deviceOptions: { value: string; label: string; user_id: string }[] =
    (devicesData?.data as Array<{ id: number; fcm_token: string; os: string | null; user_id: string }>)?.map((device) => ({
      value: String(device.id),
      label: `${device.fcm_token.substring(0, 30)}... (${device.os ?? t('unknown')})`,
      user_id: device.user_id
    })) ?? []

  const userListOptions: { value: string; label: string }[] =
    (userListsData?.data as IUserList[])?.map((list) => ({
      value: list.id,
      label: list.name
    })) ?? []

  const handleSend = async (activeTab: ActiveTab) => {
    if (!pushNotificationId) return

    if (activeTab === 'devices' && selectedDevices.length === 0) return
    if (activeTab === 'userList' && !selectedUserListId) return

    setSending(true)

    try {
      const payload: Record<string, unknown> = {
        push_notification_id: pushNotificationId
      }

      if (activeTab === 'devices') {
        const userIds = [...new Set(selectedDevices.map((d) => d.user_id))]
        payload.user_ids = userIds
      } else {
        payload.user_list_id = selectedUserListId
      }

      await sendPushNotification(payload, {
        onSuccess: () => {
          onSuccess()
        },
        onError: () => {
          //
        }
      })
    } finally {
      setSending(false)
    }
  }

  return {
    deviceOptions,
    selectedDevices,
    setSelectedDevices,
    devicesLoading,
    userListOptions,
    selectedUserListId,
    setSelectedUserListId,
    userListsLoading,
    handleSend,
    sending
  }
}
