import { useServiceDeleteCampaign } from '@/services/messages/campaigns/useServiceCampaign'
import { ICampaign } from '@/services/messages/interfaces/ICampaign'
import Button from '@axolotesource/ui/components/Buttons'
import { ButtonVariantEnum } from '@axolotesource/ui/components/Buttons/enums/buttonVariant.enum'
import { Badge } from '@axolotesource/ui/components/ui/badge'
import { SizeEnum } from '@axolotesource/ui/enums/SizeEnum'
import { useModal } from '@axolotesource/ui/hooks/useModal'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { campaignStatusColors } from './constants'

export const useCampaignPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isOpen, open, close } = useModal(false)
  const [selectedItem, setSelectedItem] = useState<Record<string, unknown> | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const { mutateAsync: deleteCampaign } = useServiceDeleteCampaign(String(selectedItem?.id ?? ''))

  const handleCreate = () => {
    setSelectedItem(null)
    open()
  }

  const handleEdit = (item: ICampaign) => {
    setSelectedItem(item)
    open()
  }

  const handleShow = (item: ICampaign) => {
    navigate(`/campaigns/${item.id}`)
  }

  const handleDelete = async (item: ICampaign) => {
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
      setSelectedItem(item)
      await deleteCampaign(undefined, {
        onSuccess: () => {
          Swal.fire({
            title: t('campaign_deleted'),
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

  const renderersMap = {
    status_name: (record: ICampaign) => record && <Badge className={campaignStatusColors[record.status_name] ?? ''}>{t(record.status_name)}</Badge>,
    started_at: (record: ICampaign) => (record.started_at ? new Date(record.started_at).toLocaleDateString() : ''),
    finished_at: (record: ICampaign) => (record.finished_at ? new Date(record.finished_at).toLocaleDateString() : ''),
    created_at: (record: ICampaign) => (record.created_at ? new Date(record.created_at).toLocaleDateString() : ''),
    actions: (record: ICampaign) => (
      <div className="flex gap-2">
        <Button variant={ButtonVariantEnum.IconOutline} size={SizeEnum.XXS} onClick={() => handleShow(record)}>
          <Eye size={14} />
        </Button>
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
