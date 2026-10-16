import { IUser } from '@/interfaces/models/User/user.interface'
import { AxiosInstance } from 'axios'

export interface IAuthContextType {
  authToken: string | null
  user: IUser | null
  isAuth: boolean
  businessId: number
  saveAuth: (accessToken: string, user: IUser) => void
  logout: () => void
  axiosApi: AxiosInstance
  updateUser: (user: IUser) => void
  fetchUser: () => Promise<void>
}
