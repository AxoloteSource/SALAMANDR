import { IReplicateUrl } from '@/services/messages/whatsapp-replicate-urls/interfaces/IReplicateUrl'
import { useServiceDeleteReplicateUrl, useServiceToggleReplicateUrl } from '@/services/messages/whatsapp-replicate-urls/useServiceReplicateUrls'
import { Badge } from '@axolotesource/ui/components/ui/badge'
import { useModal } from '@axolotesource/ui/hooks/useModal'
import { Pencil, Power, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Swal from 'sweetalert2'

export const useWebhookPage = () => {
  const { t } = useTranslation()
  const { isOpen, open, close } = useModal(false)
  const [selectedItem, setSelectedItem] = useState<Record<string, unknown> | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const { mutateAsync: deleteReplicateUrl } = useServiceDeleteReplicateUrl(String(selectedItem?.id ?? ''))
  const { mutateAsync: toggleReplicateUrl } = useServiceToggleReplicateUrl()

  const handleCreate = () => {
    setSelectedItem(null)
    open()
  }

  const handleEdit = (item: IReplicateUrl) => {
    setSelectedItem(item)
    open()
  }

  const handleToggle = async (item: IReplicateUrl) => {
    try {
      await toggleReplicateUrl(item.id, {
        onSuccess: () => setRefreshKey((prev) => prev + 1),
        onError: () => Swal.fire({ title: t('error_occurred'), icon: 'error' })
      })
    } catch {
      Swal.fire({ title: t('error_occurred'), icon: 'error' })
    }
  }

  const handleDelete = async (item: IReplicateUrl) => {
    const result = await Swal.fire({
      title: t('delete_confirmation'),
      text: t('delete_webhook_confirmation_text'),
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

    setSelectedItem(item)
    try {
      await deleteReplicateUrl(undefined, {
        onSuccess: () => {
          Swal.fire({ title: t('webhook_url_deleted'), icon: 'success', timer: 2000, showConfirmButton: false })
          setRefreshKey((prev) => prev + 1)
        },
        onError: () => Swal.fire({ title: t('error_occurred'), icon: 'error' })
      })
    } catch {
      Swal.fire({ title: t('error_occurred'), icon: 'error' })
    }
  }

  const handleSuccess = () => {
    close()
    setSelectedItem(null)
    setRefreshKey((prev) => prev + 1)
  }

  const renderersMap = {
    url: (record: IReplicateUrl) => record && <span className="break-all">{record.url}</span>,
    is_active: (record: IReplicateUrl) =>
      record ? (
        <Badge className={record.is_active === false ? 'bg-gray-400 text-white' : 'bg-success text-white'}>
          {record.is_active === false ? t('inactive') : t('active')}
        </Badge>
      ) : null,
    created_at: (record: IReplicateUrl) => (record?.created_at ? new Date(record.created_at).toLocaleString() : ''),
    actions: (record: IReplicateUrl) => (
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={record.is_active === false ? 'text-gray-400 hover:opacity-80' : 'text-success hover:opacity-80'}
          onClick={() => handleToggle(record)}
          aria-label={t('toggle_active')}
          title={t('toggle_active')}
        >
          <Power size={16} />
        </button>
        <button type="button" className="text-primary hover:opacity-80" onClick={() => handleEdit(record)} aria-label={t('edit')}>
          <Pencil size={16} />
        </button>
        <button type="button" className="text-danger hover:opacity-80" onClick={() => handleDelete(record)} aria-label={t('delete')}>
          <Trash2 size={16} />
        </button>
      </div>
    )
  }

  return {
    filters: [],
    isOpen,
    close,
    selectedItem,
    refreshKey,
    renderersMap,
    handleCreate,
    handleSuccess
  }
}
