export interface IDriver extends Record<string, unknown> {
  id: number
  name: string
  config_key: string
  created_at?: string
  updated_at?: string
}
