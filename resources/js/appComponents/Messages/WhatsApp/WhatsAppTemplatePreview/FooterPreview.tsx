import { IWhatsAppTemplateComponent } from '@/services/messages/interfaces/IWhatsAppTemplate'

export const FooterPreview = ({ component }: { component: IWhatsAppTemplateComponent | undefined }) => {
  if (!component?.text) return null

  return <div className="mt-2 text-xs text-gray-500 italic">{component.text}</div>
}
