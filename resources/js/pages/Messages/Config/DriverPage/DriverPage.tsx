import { useServiceIndexDrivers } from '@/services/messages/drivers/useServiceDriver'
import { Page } from '@axolotesource/ui/components/Page/Page'
import { DataTableFilter } from '@axolotesource/ui/components/Tables/DataTableFilter/DataTableFilter'
import { useTranslation } from 'react-i18next'
import { DriverForm } from './partials/DriverForm/DriverForm'
import { useDriverPage } from './useDriverPage'

const DriverPage = () => {
  const { t } = useTranslation()
  const { filters, renderersMap, refreshKey, isOpen, close, selectedItem, handleCreate, handleSuccess } = useDriverPage()

  return (
    <Page titleTranslation="drivers" breadCrumblesItems={[{ children: t('config') }, { children: t('drivers') }]}>
      <DataTableFilter
        key={refreshKey}
        filters={filters}
        onClickNew={handleCreate}
        service={useServiceIndexDrivers}
        renderersMap={renderersMap}
        showNewButton
      />
      <DriverForm
        key={`${String(selectedItem?.id ?? 'new')}-${isOpen}`}
        isOpen={isOpen}
        close={close}
        selectedItem={selectedItem}
        onSuccess={handleSuccess}
      />
    </Page>
  )
}

export default DriverPage
