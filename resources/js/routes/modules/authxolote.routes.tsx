import IRoute from '@/interfaces/IRoute'
import { lazy } from 'react'

const HomePage = lazy(() => import('@/pages/Authxolote/HomePage/HomePage'))
const UserPage = lazy(() => import('@/pages/Authxolote/UserPage/UserPage'))
const UserListPage = lazy(() => import('@/pages/Authxolote/UserListPage/UserListPage'))
const ApplicationsPage = lazy(() => import('@/pages/Authxolote/ApplicationsPage/ApplicationsPage'))
const MenusPage = lazy(() => import('@/pages/Authxolote/MenuPage/MenusPage/MenusPage'))
const MenuShowPage = lazy(() => import('@/pages/Authxolote/MenuPage/MenuShowPage/MenuShowPage'))
const RolePage = lazy(() => import('@/pages/Authxolote/CatalogPage/RolePage/RolePage'))
const RoleActionPage = lazy(() => import('@/pages/Authxolote/CatalogPage/RoleActionPage/RoleActionPage'))
const UiPage = lazy(() => import('@/pages/Authxolote/UiPage/UiPage'))
const PricingCardPage = lazy(() => import('@/pages/Authxolote/UiPage/PricingCardPage/PricingCardPage'))
const Privacy = lazy(() => import('@/pages/Authxolote/PrivacyPage/Privacy').then((m) => ({ default: m.Privacy })))
const TermsAndConditions = lazy(() =>
  import('@/pages/Authxolote/TermsAndConditionsPage/TermsAndConditions').then((m) => ({ default: m.TermsAndConditions }))
)

export enum RoutesAuthxolote {
  Home = '/auth',
  Users = '/auth/users',
  UserLists = '/auth/user-lists',
  MenuApplications = '/auth/applications',
  MenuMenus = '/auth/menus',
  MenuShow = '/auth/menus/show',
  Catalog = '/auth/catalogs',
  Role = '/auth/catalogs/roles',
  RoleAction = '/auth/catalogs/roles/actions',
  Ui = '/auth/ui',
  UiPricingCard = '/auth/ui/pricing-card',
  Privacy = '/privacy',
  Terms = '/termsConditions'
}

export const authxoloteRoutes: IRoute[] = [
  {
    path: RoutesAuthxolote.Home,
    element: <HomePage />,
    private: true
  },
  {
    path: RoutesAuthxolote.Users,
    element: <UserPage />,
    private: true
  },
  {
    path: RoutesAuthxolote.UserLists,
    element: <UserListPage />,
    private: true
  },
  {
    path: RoutesAuthxolote.MenuApplications,
    element: <ApplicationsPage />,
    private: true
  },
  {
    path: RoutesAuthxolote.MenuMenus,
    element: <MenusPage />,
    private: true
  },
  {
    path: RoutesAuthxolote.MenuShow,
    element: <MenuShowPage />,
    private: true
  },
  {
    path: RoutesAuthxolote.Role,
    element: <RolePage />,
    private: true
  },
  {
    path: RoutesAuthxolote.RoleAction,
    element: <RoleActionPage />,
    private: true
  },
  {
    path: RoutesAuthxolote.Ui,
    element: <UiPage />,
    private: true
  },
  {
    path: RoutesAuthxolote.UiPricingCard,
    element: <PricingCardPage />,
    private: true
  },
  {
    path: RoutesAuthxolote.Privacy,
    element: <Privacy />,
    private: false,
    layout: 'blank'
  },
  {
    path: RoutesAuthxolote.Terms,
    element: <TermsAndConditions />,
    private: false,
    layout: 'blank'
  }
]
