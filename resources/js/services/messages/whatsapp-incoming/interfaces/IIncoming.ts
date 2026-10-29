/**
 * Inbound WhatsApp (view-only) — HAG-24.
 * Shapes mirror LaraAxMessages resources:
 *   WhatsAppContact(Index|Show)Resource, WhatsAppIncomingMessage(Index|Show)Resource.
 */
export interface IIncomingContact {
  id: number
  phone: string
  name: string | null
  last_message_text: string | null
  last_message_at: string | null
  unread_count: number
  created_at: string
}

export interface IIncomingMessage {
  id: number
  contact_id: number
  wa_message_id: string | null
  type: string
  text: string | null
  media: Record<string, unknown> | null
  wa_timestamp: number | null
  /** Additive (HAG-38): both directions are returned; outbound = sent by us. */
  direction?: 'inbound' | 'outbound'
  created_at: string
}
