import Button from '@axolotesource/ui/components/Buttons'
import { ButtonVariantEnum } from '@axolotesource/ui/components/Buttons/enums/buttonVariant.enum'
import { Badge } from '@axolotesource/ui/components/ui/badge'
import { SizeEnum } from '@axolotesource/ui/enums/SizeEnum'
import { useModal } from '@axolotesource/ui/hooks/useModal'
import { IPushNotification } from '@/services/messages/interfaces/IPushNotification'
import { useServiceDeletePushNotification } from '@/services/messages/push-notifications/useServicePushNotification'
import { Pencil, Send, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Swal from 'sweetalert2'

const statusColors: Record<string, string> = {
  Pending: 'bg-gray-100 text-gray-800',
  Processing: 'bg-yellow-100 text-yellow-800',
  Sent: 'bg-green-100 text-green-800',
  Partial: 'bg-orange-100 text-orange-800',
  Failed: 'bg-red-100 text-red-800'
}

export const usePushNotificationPage = () => {
  const { t } = useTranslation()
  const { isOpen, open, close } = useModal(false)
  const { isOpen: sendModalIsOpen, open: openSendModal, close: closeSendModal } = useModal(false)
  const [selectedItem, setSelectedItem] = useState<Record<string, unknown> | null>(null)
  const [selectedSendItem, setSelectedSendItem] = useState<Record<string, unknown> | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const { mutateAsync: deletePushNotification } = useServiceDeletePushNotification(String(selectedSendItem?.id ?? ''))

  const handleCreate = () => {
    setSelectedItem(null)
    open()
  }

  const handleEdit = (item: IPushNotification) => {
    setSelectedItem(item)
    open()
  }

  const handleSend = (item: IPushNotification) => {
    setSelectedSendItem(item)
    openSendModal()
  }

  const handleDelete = async (item: IPushNotification) => {
    const result = await Swal.fire({
      title: t('delete_confirmation'),
      text: t('delete_confirmation_text'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: t('yes'),
      cancelButtonText: t('cancel')
    })

    if (!result.isConfirmed) {
      return
    }

    try {
      setSelectedSendItem(item)
      await deletePushNotification(undefined, {
        onSuccess: () => {
          Swal.fire({
            title: t('push_notification_deleted'),
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          })
          setRefreshKey((prev) => prev + 1)
        },
        onError: () => {
          Swal.fire({
            title: t('error_occurred'),
            icon: 'error'
          })
        }
      })
    } catch {
      Swal.fire({
        title: t('error_occurred'),
        icon: 'error'
      })
    }
  }

  const handleSuccess = () => {
    close()
    setSelectedItem(null)
    setRefreshKey((prev) => prev + 1)
  }

  const handleSendSuccess = () => {
    closeSendModal()
    setSelectedSendItem(null)
    setRefreshKey((prev) => prev + 1)
    Swal.fire({
      title: t('push_notification_sent'),
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    })
  }

  const renderersMap = {
    status_name: (record: IPushNotification) => record && <Badge className={statusColors[record.status_name] ?? ''}>{t(record.status_name)}</Badge>,
    total_devices: (record: IPushNotification) => record.total_devices,
    success_count: (record: IPushNotification) => record.success_count,
    failure_count: (record: IPushNotification) => record.failure_count,
    created_at: (record: IPushNotification) => (record.created_at ? new Date(record.created_at).toLocaleDateString() : ''),
    actions: (record: IPushNotification) => (
      <div className="flex gap-2">
        <Button variant={ButtonVariantEnum.IconOutline} size={SizeEnum.XXS} onClick={() => handleEdit(record)}>
          <Pencil size={14} />
        </Button>
        <Button variant={ButtonVariantEnum.IconOutline} size={SizeEnum.XXS} onClick={() => handleDelete(record)}>
          <Trash2 size={14} />
        </Button>
        <Button variant={ButtonVariantEnum.IconOutline} size={SizeEnum.XXS} onClick={() => handleSend(record)}>
          <Send size={14} />
        </Button>
      </div>
    )
  }

  return {
    filters: [],
    renderersMap,
    refreshKey,
    isOpen,
    close,
    selectedItem,
    sendModalIsOpen,
    closeSendModal,
    selectedSendItem,
    handleCreate,
    handleEdit,
    handleSend,
    handleDelete,
    handleSuccess,
    handleSendSuccess
  }
}
