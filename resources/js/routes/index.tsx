import AxoloteUIAppProvider from '@/appComponents/AxoloteUIAppProvider/AxoloteUIAppProvider'
import { useAppMenu } from '@/hooks/useAppMenu'
import { useAxios } from '@/hooks/useAxios'
import BlankLayout from '@axolotesource/ui/components/Layouts/BlankLayout'
import DefaultLayout from '@axolotesource/ui/components/Layouts/DefaultLayout'
import { createBrowserRouter, Outlet } from 'react-router-dom'
import PrivateRouteWrapper from './PrivateRouteWrapper'
import { routes } from './routes'

/**
 * Root shell: lives INSIDE RouterProvider so it can read the current location
 * and fetch the per-app menu (HAG-9), while still wrapping every layout with the
 * mandatory AxoloteUIProvider.
 */
const AppShell = () => {
  const { isAuth } = useAxios()
  // Unified menu (one slug, all sections); fetch only when authenticated.
  const { menu } = useAppMenu(isAuth)

  return (
    <AxoloteUIAppProvider menu={menu} logo="/imgs/axolote-salamandr.svg" logoDark="/imgs/logo-white.png">
      <Outlet />
    </AxoloteUIAppProvider>
  )
}

const finalRoutes = routes.map((route) => {
  const element = route.layout === 'blank' ? <BlankLayout>{route.element}</BlankLayout> : <DefaultLayout>{route.element}</DefaultLayout>

  return {
    ...route,
    element: route.private ? <PrivateRouteWrapper route={route} element={element} /> : element
  }
})

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: finalRoutes
  }
])

export default router
