import wpFondoDark from '@/appComponents/Messages/assets/wp-fondo-dark.jpg'
import wpFondo from '@/appComponents/Messages/assets/wp-fondo.jpg'
import { IWhatsAppTemplate } from '@/services/messages/interfaces/IWhatsAppTemplate'
import { Avatar } from '@axolotesource/ui/components/Avatar/Avatar'
import { ButtonsPreview } from './ButtonsPreview'
import { FooterPreview } from './FooterPreview'
import { HeaderPreview } from './HeaderPreview'
import { useWhatsAppTemplatePreview } from './useWhatsAppTemplatePreview'

interface WhatsAppTemplatePreviewProps {
  template: IWhatsAppTemplate
}

export const WhatsAppTemplatePreview = ({ template }: WhatsAppTemplatePreviewProps) => {
  const { isDark, headerComponent, footerComponent, buttonsComponent, previewText } = useWhatsAppTemplatePreview(template)

  return (
    <div
      className="rounded-lg border p-4"
      style={{
        backgroundImage: `url(${isDark ? wpFondoDark : wpFondo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-none">
          <Avatar />
        </div>
        <div className="max-w-[80%] space-y-2 rounded-md bg-gray-100 p-4 dark:bg-gray-800">
          <HeaderPreview component={headerComponent} />

          {previewText ? (
            <div className="text-sm whitespace-pre-wrap">{previewText}</div>
          ) : (
            <p className="text-sm text-gray-400 italic">No body component available for preview</p>
          )}

          <FooterPreview component={footerComponent} />
          <ButtonsPreview component={buttonsComponent} />
        </div>
      </div>
    </div>
  )
}
