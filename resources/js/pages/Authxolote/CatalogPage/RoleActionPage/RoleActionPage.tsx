import { RoutesAuthxolote } from '@/routes/modules/authxolote.routes'
import { useServiceIndexRoleActions } from '@/services/authxolote/roleActions/useServiceRoleActions'
import { Page } from '@axolotesource/ui/components/Page/Page'
import { DataTableFilter } from '@axolotesource/ui/components/Tables/DataTableFilter/DataTableFilter'
import { FilterFormRoleAction } from './partials/FilterFormRoleAction'
import { useRoleActionPage } from './useRoleActionPage'

const breadCrumblesItems = [
  { to: RoutesAuthxolote.Home, children: 'home' },
  { to: RoutesAuthxolote.Role, children: 'roles' },
  { children: 'actions' }
]

const RoleActionPage = () => {
  const { open, filters, renderersMap, refreshKey, roleId } = useRoleActionPage()
  return (
    <Page titleTranslation="Actions" breadCrumblesItems={breadCrumblesItems}>
      <DataTableFilter
        showNewButton={false}
        key={refreshKey}
        filters={filters}
        onClickNew={open}
        payload={{ roleId: roleId! }}
        service={useServiceIndexRoleActions}
        renderersMap={renderersMap}
      >
        {(formik) => <FilterFormRoleAction formik={formik} />}
      </DataTableFilter>
    </Page>
  )
}

export default RoleActionPage
