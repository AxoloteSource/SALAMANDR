import { RoutesMessages } from '@/routes/modules/messages.routes'
import ISubItem from '@axolotesource/ui/components/Layouts/SidelbarLink/subItem.interface'
import { useTranslation } from 'react-i18next'

export const useMenu = () => {
  const { t } = useTranslation()

  const whatsAppSubMenu: ISubItem[] = [
    {
      path: RoutesMessages.WhatsAppTemplates,
      name: t('whatsapp_templates')
    },
    {
      path: RoutesMessages.WhatsAppChats,
      name: t('whatsapp_chats')
    },
    {
      path: RoutesMessages.WhatsAppInfo,
      name: t('whatsapp_info')
    }
  ]

  const emailSubMenu: ISubItem[] = [
    {
      path: RoutesMessages.Emails,
      name: t('email_templates')
    }
  ]

  const pushSubMenu: ISubItem[] = [
    {
      path: RoutesMessages.PushNotifications,
      name: t('push_notifications')
    }
  ]

  return {
    t,
    whatsAppSubMenu,
    emailSubMenu,
    pushSubMenu
  }
}
