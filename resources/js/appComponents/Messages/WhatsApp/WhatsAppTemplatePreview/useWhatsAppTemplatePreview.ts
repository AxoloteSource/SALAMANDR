import { IWhatsAppTemplate, IWhatsAppTemplateComponent } from '@/services/messages/interfaces/IWhatsAppTemplate'
import { useEffect, useState } from 'react'

const replaceVariables = (text: string, variables: IWhatsAppTemplateComponent['whatsapp_template_variables']): string => {
  if (!variables) return text

  return variables.reduce((acc, variable) => {
    const placeholder = `{{${variable.position + 1}}}`
    const value = variable.example_value ?? `{{${variable.name}}}`
    return acc.replace(placeholder, value)
  }, text)
}

export const useWhatsAppTemplatePreview = (template: IWhatsAppTemplate) => {
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'))

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const headerComponent = template.components?.find((c) => c.type === 'HEADER')
  const bodyComponent = template.components?.find((c) => c.type === 'BODY')
  const footerComponent = template.components?.find((c) => c.type === 'FOOTER')
  const buttonsComponent = template.components?.find((c) => c.type === 'BUTTONS')
  const variables = bodyComponent?.whatsapp_template_variables ?? []
  const buttons = buttonsComponent?.raw_data?.buttons ?? []

  const previewText = bodyComponent?.text ? replaceVariables(bodyComponent.text, bodyComponent.whatsapp_template_variables) : undefined

  return {
    isDark,
    headerComponent,
    footerComponent,
    buttonsComponent,
    variables,
    buttons,
    previewText
  }
}
