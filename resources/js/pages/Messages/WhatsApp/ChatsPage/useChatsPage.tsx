import { IChatList } from '@axolotesource/ui/interfaces/models/Chat/IChat'
import { IMessageList } from '@axolotesource/ui/interfaces/models/Message/IMessage'
import { useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { useMemo, useState } from 'react'

const mockChatList: IChatList[] = [
  {
    id: 1,
    title: 'María García',
    subtitle: 'Hola, ¿está disponible el envío para hoy?',
    optionalMessage: '10:30',
    userId: '2'
  },
  {
    id: 2,
    title: 'Juan Pérez',
    subtitle: '¡Muchas gracias!',
    optionalMessage: '09:15',
    userId: '3'
  },
  {
    id: 3,
    title: 'Laura Martínez',
    subtitle: 'Recibí el código de verificación',
    optionalMessage: '08:40',
    userId: '4'
  }
]

const mockOtherContactsList: IChatList[] = [
  {
    id: 4,
    title: 'Carlos López',
    subtitle: 'Última conexión hace 2 horas',
    optionalMessage: 'Ayer',
    userId: '5'
  },
  {
    id: 5,
    title: 'Ana Torres',
    subtitle: 'Última conexión hace 1 día',
    optionalMessage: 'Lun',
    userId: '6'
  }
]

const mockMessages: Record<number, IMessageList[]> = {
  1: [
    { message: 'Hola, ¿está disponible el envío para hoy?', isSender: false, timeAgo: '10:30', imagePath: '' },
    { message: 'Hola María, sí, claro. ¿A qué hora prefieres?', isSender: true, timeAgo: '10:32', imagePath: '' },
    { message: 'A las 4 de la tarde estaría perfecto.', isSender: false, timeAgo: '10:33', imagePath: '' }
  ],
  2: [
    { message: '¿Me confirmas el estado de mi pedido?', isSender: false, timeAgo: '09:10', imagePath: '' },
    { message: 'Tu pedido ya fue enviado.', isSender: true, timeAgo: '09:12', imagePath: '' },
    { message: '¡Muchas gracias!', isSender: false, timeAgo: '09:15', imagePath: '' }
  ],
  3: [
    { message: 'Recibí el código de verificación', isSender: false, timeAgo: '08:40', imagePath: '' },
    { message: 'Perfecto, gracias por confirmar.', isSender: true, timeAgo: '08:42', imagePath: '' }
  ]
}

const scrollProps = { hasNextPage: false, isFetchingNextPage: false, fetchNextPage: () => {} }

export const useChatsPage = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>(null)
  const [selectedUser, setSelectedUser] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const [searchIndex, setSearchIndex] = useState('')

  const chatList = useMemo(() => {
    const term = searchIndex.toLowerCase()

    return mockChatList.filter((chat) => chat.title.toLowerCase().includes(term))
  }, [searchIndex])

  const otherContactsList = useMemo(() => {
    const term = searchIndex.toLowerCase()

    return mockOtherContactsList.filter((chat) => chat.title.toLowerCase().includes(term))
  }, [searchIndex])

  const selectedChatData = chatList.find((chat) => chat.id === selectedChat) ?? null
  const messages = selectedChat !== null ? (mockMessages[selectedChat] ?? []) : []

  const handleToggleMessagesScroll = () => {}

  const { mutateAsync: sendMessage } = useMutation({
    mutationFn: async (data: unknown) => ({ data }) as AxiosResponse
  })

  return {
    chatList,
    otherContactsList,
    currentUser: { name: 'Admin', roleName: 'Administrator' },
    setSelectedChat,
    setSearchIndex,
    scrollChatListProps: scrollProps,
    scrollMessageListProps: scrollProps,
    handleToggleMessagesScroll,
    selectUser: setSelectedUser,
    selectedUser,
    selectedChat,
    selectedChatData,
    messages,
    showMenu,
    setShowMenu,
    sendMessage
  }
}
