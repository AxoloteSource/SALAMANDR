export interface IWhatsAppTemplateVariable {
  id: string
  name: string
  position: number
  example_value: string | null
}

export interface IWhatsAppTemplateButton {
  text: string
  type: string
  url?: string
  example?: string[]
}

export interface IWhatsAppTemplateRawData {
  buttons?: IWhatsAppTemplateButton[]
  [key: string]: unknown
}

export interface IWhatsAppTemplateComponent {
  id: string
  type: string
  format: string | null
  text: string | null
  example_data: Record<string, unknown> | null
  raw_data: IWhatsAppTemplateRawData | null
  whatsapp_template_variables: IWhatsAppTemplateVariable[]
}

export interface IWhatsAppTemplate {
  id: string
  name: string
  language: string
  category: string
  status: string
  components: IWhatsAppTemplateComponent[]
  created_at: string
}
