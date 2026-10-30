import { useServiceIndexWhatsAppTemplates } from '@/services/messages/whatsapp-template/useServiceWhatsAppTemplate'
import { Page } from '@axolotesource/ui/components/Page/Page'
import { DataTableFilter } from '@axolotesource/ui/components/Tables/DataTableFilter/DataTableFilter'
import { Button } from '@axolotesource/ui/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useWhatsAppTemplatePage } from './useWhatsAppTemplatePage'

const WhatsAppTemplatePage = () => {
  const { t } = useTranslation()
  const { filters, renderersMap, refreshKey, handleSync, isSyncing } = useWhatsAppTemplatePage()

  return (
    <Page titleTranslation="whatsapp_templates">
      <div className="mb-4 flex justify-end">
        <Button onClick={handleSync} disabled={isSyncing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? t('syncing') : t('sync')}
        </Button>
      </div>

      <DataTableFilter
        key={refreshKey}
        filters={filters}
        showNewButton={false}
        withoutFilters
        onClickNew={() => {}}
        service={useServiceIndexWhatsAppTemplates}
        renderersMap={renderersMap}
      />
    </Page>
  )
}

export default WhatsAppTemplatePage
