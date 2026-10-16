import { ApisEnum } from '@/configs/apisEnum'
import { useGET } from '@/hooks/useApi'
import { IPaginate } from '@/interfaces/IPaginate'

interface IDevice {
  id: number
  fcm_token: string
  os: string | null
  active: boolean
  user_id: string
}

const url = '/api/v1/firebase/devices'

export const useServiceIndexDevices = (params: Record<string, unknown> = {}) => {
  return useGET<IPaginate<IDevice>>({ url, filters: params, customHost: ApisEnum.BaseMessages })
}
