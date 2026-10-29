import { useAxios } from '@/hooks/useAxios'
import { IIncomingContact, IIncomingMessage } from '@/services/messages/whatsapp-incoming/interfaces/IIncoming'
import { useServiceIncomingContacts, useServiceIncomingMessages } from '@/services/messages/whatsapp-incoming/useServiceWhatsAppIncoming'
import { useServiceSendWhatsAppText } from '@/services/messages/whatsapp-send-text/useServiceSendWhatsAppText'
import { IChatList } from '@axolotesource/ui/interfaces/models/Chat/IChat'
import { IMessageList } from '@axolotesource/ui/interfaces/models/Message/IMessage'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Swal from 'sweetalert2'

const CONTACTS_LIMIT = 30
const MESSAGES_LIMIT = 50

const formatTime = (waTimestamp?: number | null, iso?: string | null): string => {
  const date = waTimestamp ? new Date(waTimestamp * 1000) : iso ? new Date(iso) : null

  if (!date || Number.isNaN(date.getTime())) {
    return ''
  }

  const isToday = date.toDateString() === new Date().toDateString()

  return isToday ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : date.toLocaleDateString()
}

const contactToChatList = (contact: IIncomingContact): IChatList => ({
  id: contact.id,
  title: contact.name || contact.phone,
  subtitle: contact.last_message_text ?? '',
  optionalMessage: formatTime(null, contact.last_message_at),
  userId: String(contact.id)
})

const messageToMessageList = (message: IIncomingMessage): IMessageList => ({
  message: message.text ?? '',
  isSender: message.direction === 'outbound',
  timeAgo: formatTime(message.wa_timestamp, message.created_at),
  imagePath: (message.media?.url as string) ?? ''
})

const extractErrorMessage = (error: unknown): string | undefined => {
  const response = error as { response?: { data?: { data?: { message?: string | string[] } } } }
  const message = response?.response?.data?.data?.message

  return Array.isArray(message) ? message[0] : message
}

export const useChatsPage = () => {
  const { t } = useTranslation()
  const { user } = useAxios()
  const [selectedChat, setSelectedChatState] = useState<number | null>(null)
  const [selectedUser, setSelectedUser] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const [searchIndex, setSearchIndex] = useState('')
  const [contactsPage, setContactsPage] = useState(1)
  const [messagesPage, setMessagesPage] = useState(1)
  const [activeChatVersion, setActiveChatVersion] = useState(0)

  const setSelectedChat = (id: number) => {
    setSelectedChatState(id)
    setMessagesPage(1)
  }

  const contactsQuery = useServiceIncomingContacts(true, {
    page: contactsPage,
    limit: CONTACTS_LIMIT,
    search: searchIndex || null
  })

  const messagesQuery = useServiceIncomingMessages(selectedChat, selectedChat != null, {
    page: messagesPage,
    limit: MESSAGES_LIMIT,
    order_by: 'id',
    order: 'asc'
  })

  const { mutateAsync: sendText, isPending: isSending } = useServiceSendWhatsAppText()

  const chatList = useMemo<IChatList[]>(() => (contactsQuery.data?.data ?? []).map(contactToChatList), [contactsQuery.data])

  const messages = useMemo<IMessageList[]>(() => (messagesQuery.data?.data ?? []).map(messageToMessageList), [messagesQuery.data])

  const selectedContact = useMemo<IIncomingContact | null>(
    () => (contactsQuery.data?.data ?? []).find((contact) => contact.id === selectedChat) ?? null,
    [contactsQuery.data, selectedChat]
  )

  const selectedChatData = chatList.find((chat) => chat.id === selectedChat) ?? null

  const handleSendMessage = async ({ message }: { message: string; user_id: string }) => {
    const phoneNumber = selectedContact?.phone

    if (!phoneNumber) {
      Swal.fire({ title: t('send_message_error'), text: t('contact_without_phone'), icon: 'error' })
      throw new Error('missing_phone_number')
    }

    try {
      await sendText({ phone_number: phoneNumber, text: message })
      await messagesQuery.refetch()
      setActiveChatVersion((version) => version + 1)
      Swal.fire({ title: t('message_sent'), icon: 'success', timer: 1500, showConfirmButton: false })
    } catch (error) {
      Swal.fire({ title: t('send_message_error'), text: extractErrorMessage(error), icon: 'error' })
      throw error
    }
  }

  const contactsHasNext = (contactsQuery.data?.current_page ?? 1) < (contactsQuery.data?.last_page ?? 1)
  const messagesHasNext = (messagesQuery.data?.current_page ?? 1) < (messagesQuery.data?.last_page ?? 1)

  return {
    // contacts
    chatList,
    otherContactsList: [] as IChatList[],
    contactsLoading: contactsQuery.isLoading,
    contactsError: contactsQuery.isError,
    refetchContacts: contactsQuery.refetch,
    // messages
    messages,
    messagesLoading: messagesQuery.isLoading,
    messagesError: messagesQuery.isError,
    refetchMessages: messagesQuery.refetch,
    // reply composer
    handleSendMessage,
    isSending,
    activeChatKey: `${selectedChat}-${activeChatVersion}`,
    // selection / ui
    currentUser: { name: user?.name ?? 'Admin', roleName: user?.role?.name ?? '' },
    setSelectedChat,
    setSearchIndex,
    scrollChatListProps: {
      hasNextPage: contactsHasNext,
      isFetchingNextPage: contactsQuery.isFetching,
      fetchNextPage: () => contactsHasNext && setContactsPage((page) => page + 1)
    },
    scrollMessageListProps: {
      hasNextPage: messagesHasNext,
      isFetchingNextPage: messagesQuery.isFetching,
      fetchNextPage: () => messagesHasNext && setMessagesPage((page) => page + 1)
    },
    handleToggleMessagesScroll: () => undefined,
    selectUser: setSelectedUser,
    selectedUser,
    selectedChat,
    selectedChatData,
    showMenu,
    setShowMenu
  }
}
