import { ApisEnum } from '@/configs/apisEnum'
import { useGET } from '@/hooks/useApi'
import { IUserType } from '@/interfaces/models/User/user.interface'

const url = '/api/v1/user-types'
const urlLogin = ApisEnum.BaseLogin

export const useServiceIndexUserTypes = () => useGET<IUserType[]>({ url, customHost: urlLogin })
