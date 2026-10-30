import { RoutesAuthxolote } from '@/routes/modules/authxolote.routes'
import { useServiceIndexApplications } from '@/services/authxolote/applications/useServiceApplications'
import { Page } from '@axolotesource/ui/components/Page/Page'
import { DataTableFilter } from '@axolotesource/ui/components/Tables/DataTableFilter/DataTableFilter'
import { ApplicationForm } from './partials/ApplicationForm/ApplicationForm'
import { FilterFormApplication } from './partials/FilterFormApplication'
import { useApplicationsPage } from './useApplicationsPage'

const breadCrumblesItems = [{ to: RoutesAuthxolote.Home, children: 'home' }, { children: 'applications' }]

const ApplicationsPage = () => {
  const { filters, open, renderersMap, close, isOpen, selectedApplication, refreshKey, handleSuccess } = useApplicationsPage()
  return (
    <Page titleTranslation="applications" breadCrumblesItems={breadCrumblesItems}>
      <DataTableFilter key={refreshKey} filters={filters} onClickNew={open} service={useServiceIndexApplications} renderersMap={renderersMap}>
        {(formik) => <FilterFormApplication formik={formik} />}
      </DataTableFilter>
      <ApplicationForm onSuccess={handleSuccess} selectedApplication={selectedApplication} close={close} isOpen={isOpen} />
    </Page>
  )
}

export default ApplicationsPage
