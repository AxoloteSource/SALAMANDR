import { useServiceIndexReplicateUrls } from '@/services/messages/whatsapp-replicate-urls/useServiceReplicateUrls'
import { Page } from '@axolotesource/ui/components/Page/Page'
import { DataTableFilter } from '@axolotesource/ui/components/Tables/DataTableFilter/DataTableFilter'
import { useTranslation } from 'react-i18next'
import { WebhookForm } from './partials/WebhookForm/WebhookForm'
import { useWebhookPage } from './useWebhookPage'

const WebhookPage = () => {
  const { t } = useTranslation()
  const { filters, renderersMap, refreshKey, isOpen, close, selectedItem, handleCreate, handleSuccess } = useWebhookPage()

  return (
    <Page titleTranslation="webhook" breadCrumblesItems={[{ children: t('whatsapp') }, { children: t('webhook') }]}>
      <DataTableFilter
        key={refreshKey}
        filters={filters}
        onClickNew={handleCreate}
        service={useServiceIndexReplicateUrls}
        renderersMap={renderersMap}
        showNewButton
      />
      <WebhookForm isOpen={isOpen} close={close} selectedItem={selectedItem} onSuccess={handleSuccess} />
    </Page>
  )
}

export default WebhookPage
