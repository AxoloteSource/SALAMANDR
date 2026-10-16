import { Page } from '@axolotesource/ui/components/Page/Page'
import { TemplatePreviewCard } from './partials/TemplatePreviewCard/TemplatePreviewCard'
import { TemplatePropertiesCard } from './partials/TemplatePropertiesCard'
import { WhatsAppTemplateShowPageSkeleton } from './partials/WhatsAppTemplateShowPageSkeleton'
import { useWhatsAppTemplateShowPage } from './useWhatsAppTemplateShowPage'

const WhatsAppTemplateShowPage = () => {
  const { template, isLoading, breadCrumblesItems } = useWhatsAppTemplateShowPage()

  if (isLoading || !template) {
    return (
      <Page titleTranslation="whatsapp_template_detail" breadCrumblesItems={[]}>
        <WhatsAppTemplateShowPageSkeleton />
      </Page>
    )
  }

  return (
    <Page titleTranslation="whatsapp_template_detail" breadCrumblesItems={breadCrumblesItems}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TemplatePropertiesCard template={template} />
        <TemplatePreviewCard template={template} />
      </div>
    </Page>
  )
}

export default WhatsAppTemplateShowPage
