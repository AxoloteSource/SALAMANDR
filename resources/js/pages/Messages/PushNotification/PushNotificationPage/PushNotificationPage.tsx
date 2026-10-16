import { Page } from '@axolotesource/ui/components/Page/Page'
import { DataTableFilter } from '@axolotesource/ui/components/Tables/DataTableFilter/DataTableFilter'
import { useServiceIndexPushNotifications } from '@/services/messages/push-notifications/useServicePushNotification'
import { useTranslation } from 'react-i18next'
import { PushNotificationForm } from './partials/PushNotificationForm/PushNotificationForm'
import { SendPushNotificationModal } from './partials/SendPushNotification/SendPushNotificationModal'
import { usePushNotificationPage } from './usePushNotificationPage'

const PushNotificationPage = () => {
  const { t } = useTranslation()
  const {
    filters,
    renderersMap,
    refreshKey,
    isOpen,
    close,
    selectedItem,
    sendModalIsOpen,
    closeSendModal,
    selectedSendItem,
    handleCreate,
    handleSuccess,
    handleSendSuccess
  } = usePushNotificationPage()

  return (
    <Page titleTranslation="push_notifications" breadCrumblesItems={[{ children: t('home') }, { children: t('push_notifications') }]}>
      <DataTableFilter
        key={refreshKey}
        filters={filters}
        onClickNew={handleCreate}
        service={useServiceIndexPushNotifications}
        renderersMap={renderersMap}
        showNewButton
      />
      <PushNotificationForm onSuccess={handleSuccess} selectedItem={selectedItem} close={close} isOpen={isOpen} />
      <SendPushNotificationModal
        key={String(selectedSendItem?.id ?? '')}
        isOpen={sendModalIsOpen}
        close={closeSendModal}
        pushNotificationId={String(selectedSendItem?.id ?? '')}
        onSuccess={handleSendSuccess}
      />
    </Page>
  )
}

export default PushNotificationPage
