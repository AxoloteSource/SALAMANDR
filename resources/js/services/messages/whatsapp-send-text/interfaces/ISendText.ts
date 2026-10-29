/**
 * WhatsApp free-text reply (HAG-40 / backend HAG-38 contract).
 * POST /api/v1/whatsapp/send-text -> 201 { id, phone_number, text, direction, status, created_at }
 * Only works when the contact already has a conversation (else 422). text is 1..1024.
 */
export interface ISendWhatsAppTextPayload {
  phone_number: string
  text: string
}

export type IWhatsAppMessageDirection = 'inbound' | 'outbound'

export interface ISentWhatsAppText {
  id: number
  phone_number: string
  text: string
  direction: IWhatsAppMessageDirection
  status: string
  created_at: string
  [key: string]: unknown
}
