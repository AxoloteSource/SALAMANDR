import { IChannel } from '@/services/messages/channels/useServiceChannel'

export interface IProviderConfig {
  id: string
  name: string
  driver_id: number
  driver_name: string | null
  active: boolean
  default: boolean
  config: Record<string, unknown>
}

export interface IProvider extends Record<string, unknown> {
  id: string
  name: string
  active: boolean
  channels: IChannel[]
  driver_name: string | null
  default: boolean
  provider_config: IProviderConfig | null
}
