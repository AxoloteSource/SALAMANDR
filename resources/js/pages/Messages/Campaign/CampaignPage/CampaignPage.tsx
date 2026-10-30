import { useServiceIndexCampaigns } from '@/services/messages/campaigns/useServiceCampaign'
import { Page } from '@axolotesource/ui/components/Page/Page'
import { DataTableFilter } from '@axolotesource/ui/components/Tables/DataTableFilter/DataTableFilter'
import { useTranslation } from 'react-i18next'
import { CampaignForm } from './partials/CampaignForm/CampaignForm'
import { useCampaignPage } from './useCampaignPage'

const CampaignPage = () => {
  const { t } = useTranslation()
  const { filters, renderersMap, refreshKey, isOpen, close, selectedItem, handleCreate, handleSuccess } = useCampaignPage()

  return (
    <Page titleTranslation="campaigns" breadCrumblesItems={[{ children: t('home') }, { children: t('campaigns') }]}>
      <DataTableFilter
        key={refreshKey}
        filters={filters}
        onClickNew={handleCreate}
        service={useServiceIndexCampaigns}
        renderersMap={renderersMap}
        showNewButton
      />
      <CampaignForm onSuccess={handleSuccess} selectedItem={selectedItem} close={close} isOpen={isOpen} />
    </Page>
  )
}

export default CampaignPage
