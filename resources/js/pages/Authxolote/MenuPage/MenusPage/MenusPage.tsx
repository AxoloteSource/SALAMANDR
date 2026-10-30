import { RoutesAuthxolote } from '@/routes/modules/authxolote.routes'
import { useServiceIndexMenus } from '@/services/authxolote/menus/useServiceMenus'
import { Page } from '@axolotesource/ui/components/Page/Page'
import { DataTableFilter } from '@axolotesource/ui/components/Tables/DataTableFilter/DataTableFilter'
import { FilterFormMenu } from './partials/FilterFormMenu'
import { MenuForm } from './partials/MenuForm/MenuForm'
import { useMenusPage } from './useMenusPage'

const breadCrumblesItems = [{ to: RoutesAuthxolote.Home, children: 'home' }, { children: 'menus' }]

const MenusPage = () => {
  const { filters, open, renderersMap, close, isOpen, selectedMenu, refreshKey, handleSuccess } = useMenusPage()
  return (
    <Page titleTranslation="menus" breadCrumblesItems={breadCrumblesItems}>
      <DataTableFilter key={refreshKey} filters={filters} onClickNew={open} service={useServiceIndexMenus} renderersMap={renderersMap}>
        {(formik) => <FilterFormMenu formik={formik} />}
      </DataTableFilter>
      <MenuForm onSuccess={handleSuccess} selectedMenu={selectedMenu} close={close} isOpen={isOpen} />
    </Page>
  )
}

export default MenusPage
