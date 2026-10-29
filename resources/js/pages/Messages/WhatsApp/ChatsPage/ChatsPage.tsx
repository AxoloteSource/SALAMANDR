import { ActiveChat } from '@axolotesource/ui/components/Chat/ActiveChat/ActiveChat'
import { ChatPanel } from '@axolotesource/ui/components/Chat/ChatPanel/ChatPanel'
import { NoSelectedChat } from '@axolotesource/ui/components/Chat/NoSelectedChat/NoSelectedChat'
import { Page } from '@axolotesource/ui/components/Page/Page'
import { useTranslation } from 'react-i18next'
import { useChatsPage } from './useChatsPage'

const emptyBlock = (message: string, tone: 'muted' | 'error' = 'muted') => (
  <div
    className={`flex h-full min-h-[240px] items-center justify-center p-6 text-center text-sm ${tone === 'error' ? 'text-danger' : 'text-gray-400 dark:text-gray-500'}`}
  >
    {message}
  </div>
)

const ChatsPage = () => {
  const { t } = useTranslation()
  const {
    chatList,
    otherContactsList,
    contactsLoading,
    contactsError,
    refetchContacts,
    messages,
    messagesLoading,
    messagesError,
    refetchMessages,
    handleSendMessage,
    activeChatKey,
    currentUser,
    setSelectedChat,
    setSearchIndex,
    scrollChatListProps,
    scrollMessageListProps,
    handleToggleMessagesScroll,
    selectUser,
    selectedUser,
    selectedChat,
    selectedChatData,
    showMenu,
    setShowMenu
  } = useChatsPage()

  const breadCrumblesItems = [{ children: 'whatsapp', to: '/messages/whatsapp-templates' }, { children: 'whatsapp_chats' }]

  return (
    <Page titleTranslation="whatsapp_chats" breadCrumblesItems={breadCrumblesItems}>
      <div className="flex gap-5">
        {contactsLoading ? (
          <div className="panel w-full sm:w-80">{emptyBlock(t('loading', 'Cargando...'))}</div>
        ) : contactsError ? (
          <div className="panel w-full sm:w-80">
            {emptyBlock(t('error_occurred', 'Ocurrió un error'), 'error')}
            <div className="pb-4 text-center">
              <button className="text-primary text-sm underline" onClick={() => refetchContacts()}>
                {t('retry', 'Reintentar')}
              </button>
            </div>
          </div>
        ) : (
          <ChatPanel
            showMenu={showMenu}
            setSelectedChat={setSelectedChat}
            chatList={chatList}
            otherContactsList={otherContactsList}
            currentUser={currentUser}
            setSearchIndex={setSearchIndex}
            scrollChatListProps={scrollChatListProps}
            handleToggleMessagesScroll={handleToggleMessagesScroll}
            selectUser={selectUser}
            selectedUser={selectedUser}
          />
        )}
        <div className="panel relative h-[calc(100vh_-_150px)] flex-1">
          {selectedChat === null || !selectedChatData ? (
            <NoSelectedChat handleOpenMenu={() => setShowMenu(!showMenu)} />
          ) : messagesLoading && messages.length === 0 ? (
            emptyBlock(t('loading_messages', 'Cargando mensajes...'))
          ) : messagesError && messages.length === 0 ? (
            <div>
              {emptyBlock(t('error_occurred', 'Ocurrió un error'), 'error')}
              <div className="text-center">
                <button className="text-primary text-sm underline" onClick={() => refetchMessages()}>
                  {t('retry', 'Reintentar')}
                </button>
              </div>
            </div>
          ) : messages.length === 0 ? (
            emptyBlock(t('no_messages', 'Sin mensajes'))
          ) : (
            <ActiveChat
              key={activeChatKey}
              handleOpenMenu={() => setShowMenu(!showMenu)}
              messages={messages}
              scrollMessageListProps={scrollMessageListProps}
              titleUserCard={selectedChatData.title}
              subtitleUserCard={selectedChatData.subtitle ?? ''}
              receiverId={selectedChatData.userId ?? ''}
              selectedChat={selectedChat}
              sendMessage={handleSendMessage}
            />
          )}
        </div>
      </div>
    </Page>
  )
}

export default ChatsPage
