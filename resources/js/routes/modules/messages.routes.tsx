import IRoute from '@/interfaces/IRoute'
import { lazy } from 'react'

const HomePage = lazy(() => import('@/pages/Messages/HomePage/HomePage'))
const WhatsAppTemplatePage = lazy(() => import('@/pages/Messages/WhatsApp/WhatsAppTemplatePage/WhatsAppTemplatePage'))
const WhatsAppTemplateShowPage = lazy(() => import('@/pages/Messages/WhatsApp/WhatsAppTemplateShowPage/WhatsAppTemplateShowPage'))
const WhatsAppInfoPage = lazy(() => import('@/pages/Messages/WhatsApp/WhatsAppInfoPage/WhatsAppInfoPage'))
const ChatsPage = lazy(() => import('@/pages/Messages/WhatsApp/ChatsPage/ChatsPage'))
const EmailPage = lazy(() => import('@/pages/Messages/Email/EmailPage/EmailPage'))
const PushNotificationPage = lazy(() => import('@/pages/Messages/PushNotification/PushNotificationPage/PushNotificationPage'))
const CampaignPage = lazy(() => import('@/pages/Messages/Campaign/CampaignPage/CampaignPage'))
const CampaignShowPage = lazy(() => import('@/pages/Messages/Campaign/CampaignShowPage/CampaignShowPage'))
const UIPage = lazy(() => import('@/pages/Messages/UIPage/UIPage'))
const WebhookPage = lazy(() => import('@/pages/Messages/WhatsApp/WebhookPage/WebhookPage'))
const DriverPage = lazy(() => import('@/pages/Messages/Config/DriverPage/DriverPage'))
const ProviderPage = lazy(() => import('@/pages/Messages/Config/ProviderPage/ProviderPage'))

export enum RoutesMessages {
  Home = '/messages',
  WhatsAppInfo = '/messages/whatsapp-info',
  WhatsAppTemplates = '/messages/whatsapp-templates',
  WhatsAppTemplateShow = '/messages/whatsapp-templates/:id',
  WhatsAppChats = '/messages/whatsapp/chats',
  WhatsAppWebhook = '/messages/whatsapp/webhook',
  Emails = '/messages/emails',
  PushNotifications = '/messages/push-notifications',
  Campaigns = '/messages/campaigns',
  CampaignShow = '/messages/campaigns/:id',
  ConfigDrivers = '/messages/config/drivers',
  ConfigProviders = '/messages/config/providers',
  UI = '/messages/ui'
}

export const messagesRoutes: IRoute[] = [
  {
    path: RoutesMessages.Home,
    element: <HomePage />,
    private: true
  },
  {
    path: RoutesMessages.WhatsAppTemplates,
    element: <WhatsAppTemplatePage />,
    private: true
  },
  {
    path: RoutesMessages.WhatsAppInfo,
    element: <WhatsAppInfoPage />,
    private: true
  },
  {
    path: RoutesMessages.WhatsAppTemplateShow,
    element: <WhatsAppTemplateShowPage />,
    private: true
  },
  {
    path: RoutesMessages.WhatsAppChats,
    element: <ChatsPage />,
    private: true
  },
  {
    path: RoutesMessages.WhatsAppWebhook,
    element: <WebhookPage />,
    private: true
  },
  {
    path: RoutesMessages.Emails,
    element: <EmailPage />,
    private: true
  },
  {
    path: RoutesMessages.PushNotifications,
    element: <PushNotificationPage />,
    private: true
  },
  {
    path: RoutesMessages.Campaigns,
    element: <CampaignPage />,
    private: true
  },
  {
    path: RoutesMessages.CampaignShow,
    element: <CampaignShowPage />,
    private: true
  },
  {
    path: RoutesMessages.ConfigDrivers,
    element: <DriverPage />,
    private: true
  },
  {
    path: RoutesMessages.ConfigProviders,
    element: <ProviderPage />,
    private: true
  },
  {
    path: RoutesMessages.UI,
    element: <UIPage />,
    private: true
  }
]
