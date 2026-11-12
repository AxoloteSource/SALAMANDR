import { IUser } from '@/interfaces/models/User/user.interface'
import { RoutesAuthxolote } from '@/routes/modules/authxolote.routes'
import { useNavigate } from 'react-router-dom'

export const usePersonalAccessTokensPage = () => {
  const navigate = useNavigate()

  const openUserTokens = (user: IUser) => {
    const path = RoutesAuthxolote.DevelopPersonalAccessTokensShow.replace(':userId', encodeURIComponent(user.id))
    navigate(path, { state: { user } })
  }

  return { openUserTokens }
}
