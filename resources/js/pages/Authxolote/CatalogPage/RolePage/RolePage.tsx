import { RoutesAuthxolote } from '@/routes/modules/authxolote.routes'
import { useServiceIndexRoles } from '@/services/authxolote/roles/useServiceRoles'
import { Page } from '@axolotesource/ui/components/Page/Page'
import { DataTableFilter } from '@axolotesource/ui/components/Tables/DataTableFilter/DataTableFilter'
import { FilterFormRole } from './partials/FilterFormRole'
import { RoleForm } from './partials/RoleForm'
import { useRolePage } from './useRolePage'

const breadCrumblesItems = [{ to: RoutesAuthxolote.Home, children: 'home' }, { children: 'role' }]

const RolePage = () => {
  const { filters, open, renderersMap, close, isOpen, selectedRole, refreshKey, handleSuccess } = useRolePage()
  return (
    <Page titleTranslation="role" breadCrumblesItems={breadCrumblesItems}>
      <DataTableFilter key={refreshKey} filters={filters} onClickNew={open} service={useServiceIndexRoles} renderersMap={renderersMap}>
        {(formik) => <FilterFormRole formik={formik} />}
      </DataTableFilter>
      <RoleForm onSuccess={handleSuccess} selectedRole={selectedRole} close={close} isOpen={isOpen} />
    </Page>
  )
}

export default RolePage
