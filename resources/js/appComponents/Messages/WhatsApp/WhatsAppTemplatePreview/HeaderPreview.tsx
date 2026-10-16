import { IWhatsAppTemplateComponent } from '@/services/messages/interfaces/IWhatsAppTemplate'
import { FileText, Image, Video } from 'lucide-react'

const replaceVariables = (text: string, variables: IWhatsAppTemplateComponent['whatsapp_template_variables']): string => {
  if (!variables) return text

  return variables.reduce((acc, variable) => {
    const placeholder = `{{${variable.position + 1}}}`
    const value = variable.example_value ?? `{{${variable.name}}}`
    return acc.replace(placeholder, value)
  }, text)
}

export const HeaderPreview = ({ component }: { component: IWhatsAppTemplateComponent | undefined }) => {
  if (!component) return null

  if (component.format === 'IMAGE') {
    return (
      <div className="mb-2 flex items-center gap-2 rounded-md bg-gray-100 p-3 dark:bg-gray-800">
        <Image className="h-5 w-5 text-gray-500" />
        <span className="text-sm text-gray-500 italic">Header image</span>
      </div>
    )
  }

  if (component.format === 'VIDEO') {
    return (
      <div className="mb-2 flex items-center gap-2 rounded-md bg-gray-100 p-3 dark:bg-gray-800">
        <Video className="h-5 w-5 text-gray-500" />
        <span className="text-sm text-gray-500 italic">Header video</span>
      </div>
    )
  }

  if (component.format === 'DOCUMENT') {
    return (
      <div className="mb-2 flex items-center gap-2 rounded-md bg-gray-100 p-3 dark:bg-gray-800">
        <FileText className="h-5 w-5 text-gray-500" />
        <span className="text-sm text-gray-500 italic">Header document</span>
      </div>
    )
  }

  const text = component.text ? replaceVariables(component.text, component.whatsapp_template_variables) : null

  if (!text) return null

  return <div className="mb-2 text-sm font-semibold">{text}</div>
}
