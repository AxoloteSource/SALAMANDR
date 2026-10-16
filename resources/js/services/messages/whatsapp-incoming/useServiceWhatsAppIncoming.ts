import { ApisEnum } from '@/configs/apisEnum'
import { useGET } from '@/hooks/useApi'
import { IPaginate } from '@/interfaces/IPaginate'
import { IIncomingContact, IIncomingMessage } from './interfaces/IIncoming'

/**
 * Inbound WhatsApp API (HAG-24, view-only). Both endpoints are paginated
 * (`IndexLogic` -> `{status,message,data:{current_page,data:[...],...}}`, which the
 * axios interceptor unwraps to a Laravel paginator `IPaginate<T>`).
 *   GET {VITE_MESSAGES_URL}/api/v1/whatsapp/incoming/contacts
 *   GET {VITE_MESSAGES_URL}/api/v1/whatsapp/incoming/contacts/{contact}/messages
 */
const base = '/api/v1/whatsapp/incoming'

export const useServiceIncomingContacts = (enabled = true, filters: object = {}) =>
  useGET<IPaginate<IIncomingContact>>({
    url: `${base}/contacts`,
    customHost: ApisEnum.BaseMessages,
    enabled,
    nameQuery: 'incoming-contacts',
    filters
  })

export const useServiceIncomingMessages = (contactId: number | null, enabled = true, filters: object = {}) =>
  useGET<IPaginate<IIncomingMessage>>({
    url: `${base}/contacts/${contactId}/messages`,
    customHost: ApisEnum.BaseMessages,
    enabled: enabled && contactId != null,
    nameQuery: `incoming-messages-${contactId}`,
    filters
  })
