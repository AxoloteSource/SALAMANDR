import { useAxios } from '@/hooks/useAxios'
import IRoute from '@/interfaces/IRoute'
import PrivateRoute from '@axolotesource/ui/components/PrivateRoute/PrivateRoute'
import { JSX } from 'react'
import { AuthRoutes } from './modules/auth.routes'
import { ErrorRoutes } from './modules/errors.routes'

const PrivateRouteWrapper = ({ element, route }: { element: JSX.Element; route: IRoute }) => {
  const { isAuth, user, isInitializing } = useAxios()

  if (isInitializing) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-gray-400 dark:text-gray-500">Cargando...</div>
  }

  return (
    <PrivateRoute
      element={element}
      isAuthenticated={isAuth}
      user={user}
      hasPermission={route.hasPermission}
      loginPath={AuthRoutes.Login}
      forbiddenPath={ErrorRoutes.Forbidden}
    />
  )
}

export default PrivateRouteWrapper
