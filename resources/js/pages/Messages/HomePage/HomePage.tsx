import { Card, CardContent, CardHeader, CardTitle } from '@axolotesource/ui/components/ui/card'
import { Activity, Mail, MessageSquare, Smartphone } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const HomePage = () => {
  const { t } = useTranslation()

  const stats = [
    { title: t('messages_sent'), value: '0', icon: MessageSquare, color: 'text-blue-500' },
    { title: t('devices'), value: '0', icon: Smartphone, color: 'text-green-500' },
    { title: t('emails'), value: '0', icon: Mail, color: 'text-purple-500' },
    { title: t('active'), value: t('online'), icon: Activity, color: 'text-emerald-500' }
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('dashboard')}</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('welcome_message')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{t('welcome_description')}</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default HomePage
