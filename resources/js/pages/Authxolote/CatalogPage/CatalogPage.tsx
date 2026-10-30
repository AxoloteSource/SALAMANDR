import { RoutesAuthxolote } from '@/routes/modules/authxolote.routes'
import { Page } from '@axolotesource/ui/components/Page/Page'

const breadCrumblesItems = [{ to: RoutesAuthxolote.Home, children: 'home' }, { children: 'catalogs' }]

const CatalogPage = () => {
  return <Page titleTranslation="catalogs" breadCrumblesItems={breadCrumblesItems}></Page>
}

export default CatalogPage
