import { ApisEnum } from '@/configs/apisEnum'
import { useGET } from '@/hooks/useApi'

export interface IChannel {
  id: number
  name: string
}

interface IChannelResponse {
  data: IChannel[]
}

const url = '/api/v1/channels'

export const useServiceIndexChannels = () => {
  return useGET<IChannelResponse>({ customHost: ApisEnum.BaseMessages, url })
}
