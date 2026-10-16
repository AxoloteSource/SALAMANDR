import { IWhatsAppTemplateComponent } from '@/services/messages/interfaces/IWhatsAppTemplate'

export const ButtonsPreview = ({ component }: { component: IWhatsAppTemplateComponent | undefined }) => {
  const buttons = (component?.raw_data as { buttons?: Array<{ type: string; text: string }> } | null)?.buttons

  if (!buttons?.length) return null

  return (
    <div className="mt-3 space-y-2">
      {buttons.map((button, index) => (
        <div
          key={index}
          className="cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          {button.text}
        </div>
      ))}
    </div>
  )
}
