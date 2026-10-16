import Card from '@axolotesource/ui/components/Card/Card'
import { Page } from '@axolotesource/ui/components/Page/Page'
import { DataTable } from '@axolotesource/ui/components/Tables/DataTable/DataTable'
import type { IDataTableCustomProps } from '@axolotesource/ui/components/Tables/DataTable/IDataTableCustomProps'
import { Badge } from '@axolotesource/ui/components/ui/badge'
import { useTranslation } from 'react-i18next'
import { campaignStatusColors } from './constants'
import { CampaignSendModal } from './partials/CampaignSendModal/CampaignSendModal'
import { useCampaignShowPage } from './useCampaignShowPage'

const CampaignShowPage = () => {
  const { t } = useTranslation()
  const {
    campaign,
    isLoading,
    breadCrumblesItems,
    dataTableProps,
    isPhonesLoading,
    isSendModalOpen,
    closeSendModal,
    handleSendCampaign,
    isSending,
    sendButton
  } = useCampaignShowPage()

  if (isLoading || !campaign) {
    return (
      <Page titleTranslation="campaign_detail" breadCrumblesItems={[]}>
        <div className="flex items-center justify-center p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      </Page>
    )
  }

  return (
    <Page titleTranslation="campaign_detail" breadCrumblesItems={breadCrumblesItems} headerAction={sendButton}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-[var(--text)]">{t('campaign_properties')}</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">{t('name')}</label>
              <p className="text-[var(--text)]">{campaign.name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">{t('channel')}</label>
              <p className="text-[var(--text)]">{campaign.channel_name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">{t('status')}</label>
              <div>
                <Badge className={campaignStatusColors[campaign.status_name] ?? ''}>{campaign.status_name}</Badge>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">{t('template')}</label>
              <p className="text-[var(--text)]">{campaign.template_name ?? 'N/A'}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-[var(--text)]">{t('dates')}</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">{t('started_at')}</label>
              <p className="text-[var(--text)]">{campaign.started_at ? new Date(campaign.started_at).toLocaleString() : 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">{t('finished_at')}</label>
              <p className="text-[var(--text)]">{campaign.finished_at ? new Date(campaign.finished_at).toLocaleString() : 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">{t('created_at')}</label>
              <p className="text-[var(--text)]">{new Date(campaign.created_at).toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>
      <Card className="mt-6 p-6">
        <h3 className="mb-4 text-lg font-semibold text-[var(--text)]">{t('phones')}</h3>
        <DataTable datatablePros={dataTableProps as IDataTableCustomProps['datatablePros']} isLoading={isPhonesLoading} />
      </Card>

      {campaign.whatsapp_template && (
        <CampaignSendModal
          isOpen={isSendModalOpen}
          close={closeSendModal}
          template={campaign.whatsapp_template}
          onSend={handleSendCampaign}
          isSending={isSending}
        />
      )}
    </Page>
  )
}

export default CampaignShowPage
