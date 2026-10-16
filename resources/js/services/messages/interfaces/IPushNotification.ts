export interface IPushNotification extends Record<string, unknown> {
  id: string
  title: string
  body: string
  data?: Record<string, unknown> | null
  user_ids?: string[] | null
  status_name: string
  push_notification_status_id: number
  total_devices: number
  success_count: number
  failure_count: number
  created_at: string
  updated_at: string
}
