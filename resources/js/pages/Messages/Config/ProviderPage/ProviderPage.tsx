import { Page } from '@axolotesource/ui/components/Page/Page'
import { DataTableFilter } from '@axolotesource/ui/components/Tables/DataTableFilter/DataTableFilter'
import { useServiceIndexProviders } from '@/services/messages/providers/useServiceProvider'
import { useTranslation } from 'react-i18next'
import { ProviderForm } from './partials/ProviderForm/ProviderForm'
import { useProviderPage } from './useProviderPage'

const ProviderPage = () => {
  const { t } = useTranslation()
  const { filters, renderersMap, refreshKey, isOpen, close, selectedItem, handleCreate, handleSuccess } = useProviderPage()

  return (
    <Page titleTranslation="providers" breadCrumblesItems={[{ children: t('config') }, { children: t('providers') }]}>
      <DataTableFilter
        key={refreshKey}
        filters={filters}
        onClickNew={handleCreate}
        service={useServiceIndexProviders}
        renderersMap={renderersMap}
        showNewButton
      />
      <ProviderForm
        key={`${String(selectedItem?.id ?? 'new')}-${isOpen}`}
        isOpen={isOpen}
        close={close}
        selectedItem={selectedItem}
        onSuccess={handleSuccess}
      />
    </Page>
  )
}

export default ProviderPage
