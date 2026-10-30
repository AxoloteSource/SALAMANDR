import { useMenu } from '@/appComponents/Messages/Menu/useMenu'
import { RoutesMessages } from '@/routes/modules/messages.routes'
import { SidebarLink } from '@axolotesource/ui/components/Layouts/SidelbarLink/SidebarLink'
import { Bell, Code2, House, Mail, Megaphone, MessageSquare } from 'lucide-react'

const iconsClassName = 'group-hover:!text-primary shrink-0 ltr:mr-2'

export const Menu = () => {
  const { t, whatsAppSubMenu, emailSubMenu, pushSubMenu } = useMenu()

  return (
    <ul>
      <SidebarLink name={t('home')} to={RoutesMessages.Home} icon={<House className={iconsClassName} />} />
      <SidebarLink
        name={t('whatsapp')}
        to={RoutesMessages.WhatsAppTemplates}
        icon={<MessageSquare className={iconsClassName} />}
        subItems={whatsAppSubMenu}
      />
      <SidebarLink name={t('email')} to={RoutesMessages.Emails} icon={<Mail className={iconsClassName} />} subItems={emailSubMenu} />
      <SidebarLink
        name={t('push_notifications')}
        to={RoutesMessages.PushNotifications}
        icon={<Bell className={iconsClassName} />}
        subItems={pushSubMenu}
      />
      <SidebarLink name={t('campaigns')} to={RoutesMessages.Campaigns} icon={<Megaphone className={iconsClassName} />} />
      <SidebarLink name="UI" to={RoutesMessages.UI} icon={<Code2 className={iconsClassName} />} />
    </ul>
  )
}
