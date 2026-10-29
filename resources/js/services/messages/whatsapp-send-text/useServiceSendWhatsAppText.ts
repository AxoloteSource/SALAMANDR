import { ApisEnum } from '@/configs/apisEnum'
import { usePOST } from '@/hooks/useApi'
import { ISendWhatsAppTextPayload, ISentWhatsAppText } from './interfaces/ISendText'

/**
 * Sends a free-text WhatsApp reply to a contact that already has a conversation.
 * POST {VITE_MESSAGES_URL}/api/v1/whatsapp/send-text, customHost BaseMessages.
 */
const url = '/api/v1/whatsapp/send-text'

export const useServiceSendWhatsAppText = () => usePOST<ISentWhatsAppText>({ customHost: ApisEnum.BaseMessages, url })

export type { ISendWhatsAppTextPayload }
