import { IUser } from '@/interfaces/models/User/user.interface'
import { AxiosInstance } from 'axios'

export interface IAuthContextType {
  authToken: string | null
  user: IUser | null
  isAuth: boolean
  isInitializing: boolean
  sessionExpired: boolean
  businessId: number
  saveAuth: (accessToken: string, refreshToken: string, user: IUser) => void
  logout: () => Promise<void>
  axiosApi: AxiosInstance
  updateUser: (user: IUser) => void
  fetchUser: () => Promise<void>
}
