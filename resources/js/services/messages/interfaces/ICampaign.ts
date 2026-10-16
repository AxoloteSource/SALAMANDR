import { IWhatsAppTemplate } from '@/services/messages/interfaces/IWhatsAppTemplate'

export interface ICampaign extends Record<string, unknown> {
  id: string
  name: string
  channel_name: string
  status_name: string
  template_name: string | null
  whatsapp_template?: IWhatsAppTemplate
  started_at: string | null
  finished_at: string | null
  created_at: string
}
