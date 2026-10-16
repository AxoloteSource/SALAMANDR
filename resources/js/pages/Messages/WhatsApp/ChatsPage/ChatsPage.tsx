import { ActiveChat } from '@axolotesource/ui/components/Chat/ActiveChat/ActiveChat'
import { ChatPanel } from '@axolotesource/ui/components/Chat/ChatPanel/ChatPanel'
import { NoSelectedChat } from '@axolotesource/ui/components/Chat/NoSelectedChat/NoSelectedChat'
import { Page } from '@axolotesource/ui/components/Page/Page'
import { useChatsPage } from './useChatsPage'

const ChatsPage = () => {
  const {
    chatList,
    otherContactsList,
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
    messages,
    showMenu,
    setShowMenu,
    sendMessage
  } = useChatsPage()

  const breadCrumblesItems = [{ children: 'whatsapp', to: '/messages/whatsapp-templates' }, { children: 'whatsapp_chats' }]

  return (
    <Page titleTranslation="whatsapp_chats" breadCrumblesItems={breadCrumblesItems}>
      <div className="flex gap-5">
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
        <div className="panel relative h-[calc(100vh_-_150px)] flex-1">
          {selectedChat !== null && selectedChatData ? (
            <ActiveChat
              handleOpenMenu={() => setShowMenu(!showMenu)}
              messages={messages}
              scrollMessageListProps={scrollMessageListProps}
              titleUserCard={selectedChatData.title}
              subtitleUserCard={selectedChatData.subtitle ?? ''}
              receiverId={selectedChatData.userId ?? ''}
              selectedChat={selectedChat}
              sendMessage={sendMessage}
            />
          ) : (
            <NoSelectedChat handleOpenMenu={() => setShowMenu(!showMenu)} />
          )}
        </div>
      </div>
    </Page>
  )
}

export default ChatsPage
