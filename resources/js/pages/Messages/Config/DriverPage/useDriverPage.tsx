import { IDriver } from '@/services/messages/drivers/interfaces/IDriver'
import { useServiceDeleteDriver } from '@/services/messages/drivers/useServiceDriver'
import Button from '@axolotesource/ui/components/Buttons'
import { ButtonVariantEnum } from '@axolotesource/ui/components/Buttons/enums/buttonVariant.enum'
import { SizeEnum } from '@axolotesource/ui/enums/SizeEnum'
import { useModal } from '@axolotesource/ui/hooks/useModal'
import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Swal from 'sweetalert2'

export const useDriverPage = () => {
  const { t } = useTranslation()
  const { isOpen, open, close } = useModal(false)
  const [selectedItem, setSelectedItem] = useState<Record<string, unknown> | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const { mutateAsync: deleteDriver } = useServiceDeleteDriver(String(selectedItem?.id ?? ''))

  const getErrorMessage = (error: unknown) => {
    const err = error as { response?: { data?: { message?: string } } }
    return err.response?.data?.message ?? t('error_occurred')
  }

  const handleCreate = () => {
    setSelectedItem(null)
    open()
  }

  const handleEdit = (item: IDriver) => {
    setSelectedItem(item)
    open()
  }

  const handleDelete = async (item: IDriver) => {
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
      await deleteDriver(undefined, {
        onSuccess: () => {
          Swal.fire({
            title: t('driver_deleted'),
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
    created_at: (record: IDriver) => (record.created_at ? new Date(record.created_at).toLocaleDateString() : ''),
    actions: (record: IDriver) => (
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
