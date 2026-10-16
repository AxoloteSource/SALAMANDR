import { useAxios } from '@/hooks/useAxios'
import IRoute from '@/interfaces/IRoute'
import PrivateRoute from '@axolotesource/ui/components/PrivateRoute/PrivateRoute'
import { JSX } from 'react'
import { AuthRoutes } from './modules/auth.routes'
import { ErrorRoutes } from './modules/errors.routes'

const PrivateRouteWrapper = ({ element, route }: { element: JSX.Element; route: IRoute }) => {
  const { isAuth, user } = useAxios()

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
