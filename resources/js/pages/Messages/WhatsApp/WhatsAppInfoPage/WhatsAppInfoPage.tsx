import InfoBox from '@axolotesource/ui/components/InfoBox/InfoBox'
import { Page } from '@axolotesource/ui/components/Page/Page'
import { useTranslation } from 'react-i18next'
import { WhatsAppInfoPageSkeleton } from './partials/WhatsAppInfoPageSkeleton'
import { useWhatsAppInfoPage } from './useWhatsAppInfoPage'

const ratingColorMap: Record<string, string> = {
  GREEN: 'bg-green-500',
  YELLOW: 'bg-yellow-500',
  RED: 'bg-red-500'
}

const WhatsAppInfoPage = () => {
  const { t } = useTranslation()
  const { info, isLoading, breadCrumblesItems } = useWhatsAppInfoPage()

  if (isLoading || !info) {
    return (
      <Page titleTranslation="whatsapp_info">
        <WhatsAppInfoPageSkeleton />
      </Page>
    )
  }

  const ratingColor = ratingColorMap[info.quality_rating] ?? 'bg-gray-400'

  return (
    <Page titleTranslation="whatsapp_info" breadCrumblesItems={breadCrumblesItems}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <InfoBox>
          <p className="text-muted-foreground mb-2 text-sm">{t('phone_number_id')}</p>
          <p className="text-lg font-bold break-all">{info.id}</p>
        </InfoBox>

        <InfoBox>
          <p className="text-muted-foreground mb-2 text-sm">{t('verified_name')}</p>
          <p className="text-lg font-bold">{info.verified_name || '—'}</p>
        </InfoBox>

        <InfoBox>
          <p className="text-muted-foreground mb-2 text-sm">{t('quality_rating')}</p>
          <div className="flex items-center gap-2">
            <span className={`inline-block h-3 w-3 rounded-full ${ratingColor}`} />
            <p className="text-lg font-bold">{info.quality_rating || '—'}</p>
          </div>
        </InfoBox>

        <InfoBox>
          <p className="text-muted-foreground mb-2 text-sm">{t('quality_score')}</p>
          <p className="text-lg font-bold">{info.quality_score || '—'}</p>
        </InfoBox>
      </div>
    </Page>
  )
}

export default WhatsAppInfoPage
