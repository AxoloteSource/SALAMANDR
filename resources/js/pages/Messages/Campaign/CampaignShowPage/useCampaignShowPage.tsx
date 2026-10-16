import Button from '@axolotesource/ui/components/Buttons'
import { ButtonVariantEnum } from '@axolotesource/ui/components/Buttons/enums/buttonVariant.enum'
import { Badge } from '@axolotesource/ui/components/ui/badge'
import { useDataTable } from '@axolotesource/ui/hooks/useDataTable'
import { useModal } from '@axolotesource/ui/hooks/useModal'
import { useServiceCampaignPhones, useServiceSendCampaign, useServiceShowCampaign } from '@/services/messages/campaigns/useServiceCampaign'
import { Send } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { whatsappStatusColors } from './constants'

export const useCampaignShowPage = () => {
  const { id } = useParams<{ id: string }>()

  const { data: campaign, isLoading, refetch } = useServiceShowCampaign(id ?? '')

  const { dataTableProps, isLoading: isPhonesLoading } = useDataTable({
    service: useServiceCampaignPhones,
    payload: { id: id ?? '' },
    renderersMap: {
      whatsapp_status: (record) => (
        <Badge className={whatsappStatusColors[record.whatsapp_status as string] ?? ''}>{record.whatsapp_status as string}</Badge>
      )
    }
  })

  const { isOpen, open, close } = useModal(false)

  const mutation = useServiceSendCampaign(id ?? '')

  const handleSendCampaign = (params: Array<{ key: string; value: string; type: string }>) => {
    mutation.mutateAsync(
      { params },
      {
        onSuccess: () => {
          close()
          refetch()
        }
      }
    )
  }

  const sendButton = (
    <Button variant={ButtonVariantEnum.Solid} disabled={campaign?.status_name !== 'Pending'} onClick={open}>
      <Send className="mr-2 h-4 w-4" />
      Send Campaign
    </Button>
  )

  const breadCrumblesItems = [{ children: 'campaigns', to: '/campaigns' }, { children: campaign?.name ?? '...' }]

  return {
    campaign,
    isLoading,
    breadCrumblesItems,
    dataTableProps,
    isPhonesLoading,
    isSendModalOpen: isOpen,
    openSendModal: open,
    closeSendModal: close,
    handleSendCampaign,
    isSending: mutation.isPending,
    sendButton
  }
}
