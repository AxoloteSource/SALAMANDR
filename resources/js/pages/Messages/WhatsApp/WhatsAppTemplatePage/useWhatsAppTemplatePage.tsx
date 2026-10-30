import { IWhatsAppTemplate, IWhatsAppTemplateComponent } from '@/services/messages/interfaces/IWhatsAppTemplate'
import { useServiceSyncWhatsAppTemplates } from '@/services/messages/whatsapp-template/useServiceSyncWhatsAppTemplates'
import { alertSwal } from '@axolotesource/ui/components/AlertSwal/AlertSwal'
import { Badge } from '@axolotesource/ui/components/ui/badge'
import { Button } from '@axolotesource/ui/components/ui/button'
import { AlertTypeEnum } from '@axolotesource/ui/enums/types/AlertTypeEnum'
import { Eye } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const statusColors: Record<string, string> = {
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  DELETED: 'bg-gray-100 text-gray-800',
  PAUSED: 'bg-orange-100 text-orange-800',
  IN_REVIEW: 'bg-blue-100 text-blue-800'
}

export const useWhatsAppTemplatePage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [refreshKey, setRefreshKey] = useState(0)
  const { mutateAsync: syncTemplates, isPending: isSyncing } = useServiceSyncWhatsAppTemplates()

  const handleSync = async () => {
    try {
      const response = await syncTemplates({})
      const synced = response?.data?.synced ?? 0
      alertSwal({
        type: AlertTypeEnum.SuccessNotification,
        title: t('sync_completed'),
        text: t('synced_templates', { count: synced })
      })
      setRefreshKey((prev) => prev + 1)
    } catch {
      alertSwal({
        type: AlertTypeEnum.ErrorNotification,
        title: t('sync_error'),
        text: t('sync_error_text')
      })
    }
  }

  const renderersMap = {
    status: (record: IWhatsAppTemplate) =>
      record && <Badge className={statusColors[record.status] ?? 'bg-gray-100 text-gray-800'}>{t(record.status)}</Badge>,
    actions: (data: IWhatsAppTemplate) => (
      <Button size="icon" variant="outline" onClick={() => navigate(`/whatsapp-templates/${data.id}`)}>
        <Eye />
      </Button>
    )
  }

  const rowExpansion = {
    content: ({ record }: { record: IWhatsAppTemplate }) => (
      <div className="space-y-2 p-4">
        {record.components?.length > 0 ? (
          record.components.map((component: IWhatsAppTemplateComponent) => (
            <div key={component.id} className="rounded-md border p-2 text-xs">
              <div className="flex gap-2">
                <Badge variant="outline" className="text-[10px]">
                  {component.type}
                </Badge>
                {component.format && (
                  <Badge variant="outline" className="text-[10px]">
                    {component.format}
                  </Badge>
                )}
              </div>
              {component.text && <p className="text-muted-foreground mt-1 line-clamp-2">{component.text}</p>}
              {component.whatsapp_template_variables?.length > 0 && (
                <div className="text-muted-foreground mt-1">
                  {t('variables')}: {component.whatsapp_template_variables.length}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-xs">{t('no_components')}</p>
        )}
      </div>
    )
  }

  return {
    filters: [],
    renderersMap,
    rowExpansion,
    refreshKey,
    handleSync,
    isSyncing
  }
}
