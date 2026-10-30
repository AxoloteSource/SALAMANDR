import Button from '@axolotesource/ui/components/Buttons'
import { ButtonVariantEnum } from '@axolotesource/ui/components/Buttons/enums/buttonVariant.enum'
import { Badge } from '@axolotesource/ui/components/ui/badge'
import { SizeEnum } from '@axolotesource/ui/enums/SizeEnum'
import { useModal } from '@axolotesource/ui/hooks/useModal'
import { IProvider } from '@/services/messages/providers/interfaces/IProvider'
import { useServiceDeleteProvider } from '@/services/messages/providers/useServiceProvider'
import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Swal from 'sweetalert2'

export const useProviderPage = () => {
  const { t } = useTranslation()
  const { isOpen, open, close } = useModal(false)
  const [selectedItem, setSelectedItem] = useState<Record<string, unknown> | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const { mutateAsync: deleteProvider } = useServiceDeleteProvider(String(selectedItem?.id ?? ''))

  const getErrorMessage = (error: unknown) => {
    const err = error as { response?: { data?: { message?: string } } }
    return err.response?.data?.message ?? t('error_occurred')
  }

  const handleCreate = () => {
    setSelectedItem(null)
    open()
  }

  const handleEdit = (item: IProvider) => {
    setSelectedItem(item)
    open()
  }

  const handleDelete = async (item: IProvider) => {
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

    setSelectedItem(item)

    try {
      await deleteProvider(undefined, {
        onSuccess: () => {
          Swal.fire({
            title: t('provider_deleted'),
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          })
          setRefreshKey((prev) => prev + 1)
        },
        onError: (error) => {
          Swal.fire({
            title: t('error_occurred'),
            text: getErrorMessage(error),
            icon: 'error'
          })
        }
      })
    } catch (error) {
      Swal.fire({
        title: t('error_occurred'),
        text: getErrorMessage(error),
        icon: 'error'
      })
    }
  }

  const handleSuccess = () => {
    close()
    setSelectedItem(null)
    setRefreshKey((prev) => prev + 1)
  }

  const renderersMap = {
    active: (record: IProvider) => (
      <Badge className={record.active ? 'bg-success text-white' : 'bg-gray-400 text-white'}>
        {record.active ? t('active') : t('inactive')}
      </Badge>
    ),
    channels: (record: IProvider) =>
      record.channels?.length ? (
        <div className="flex flex-wrap gap-1">
          {record.channels.map((channel) => (
            <Badge key={channel.id} className="bg-blue-100 text-blue-800">
              {channel.name}
            </Badge>
          ))}
        </div>
      ) : (
        '-'
      ),
    driver_name: (record: IProvider) => record.driver_name ?? '-',
    default: (record: IProvider) => (
      <Badge className={record.default ? 'bg-success text-white' : 'bg-gray-400 text-white'}>
        {record.default ? t('yes') : t('no')}
      </Badge>
    ),
    actions: (record: IProvider) => (
      <div className="flex gap-2">
        <Button variant={ButtonVariantEnum.IconOutline} size={SizeEnum.XXS} onClick={() => handleEdit(record)}>
          <Pencil size={14} />
        </Button>
        <Button variant={ButtonVariantEnum.IconOutline} size={SizeEnum.XXS} onClick={() => handleDelete(record)}>
          <Trash2 size={14} />
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
    handleCreate,
    handleSuccess
  }
}
