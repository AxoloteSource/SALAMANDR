import Button from '@axolotesource/ui/components/Buttons'
import { ButtonVariantEnum } from '@axolotesource/ui/components/Buttons/enums/buttonVariant.enum'
import Card from '@axolotesource/ui/components/Card'
import CardTitle from '@axolotesource/ui/components/Card/partials/CardTitle'
import { CodeBlock } from '@axolotesource/ui/components/CodeBlock/CodeBlock'
import Modal from '@axolotesource/ui/components/Modal/Modal'
import { Badge } from '@axolotesource/ui/components/ui/badge'
import { useModal } from '@axolotesource/ui/hooks/useModal'
import { IWhatsAppTemplate } from '@/services/messages/interfaces/IWhatsAppTemplate'
import { Code2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  APPROVED: 'default',
  REJECTED: 'destructive',
  PENDING: 'secondary'
}

const buildExamplePayload = (template: IWhatsAppTemplate): string => {
  const payload: Record<string, unknown> = {
    messaging_product: 'whatsapp',
    to: '{{PHONE_NUMBER}}',
    type: 'template',
    template: {
      name: template.name,
      language: { code: template.language },
      components: template.components.map((component) => ({
        type: component.type,
        ...(component.format && { format: component.format }),
        parameters: component.whatsapp_template_variables.map((v) => ({
          type: 'text',
          text: v.example_value || `{{${v.name}}}`
        }))
      }))
    }
  }
  return JSON.stringify(payload, null, 2)
}

interface Props {
  template: IWhatsAppTemplate
}

export const TemplatePropertiesCard = ({ template }: Props) => {
  const { t } = useTranslation()
  const { isOpen: codeModalIsOpen, open: openCodeModal, close: closeCodeModal } = useModal(false)

  return (
    <Card>
      <CardTitle
        actionButton={
          <Button variant={ButtonVariantEnum.Solid} onClick={openCodeModal}>
            <Code2 className="mr-2 h-4 w-4" />
            {t('code')}
          </Button>
        }
      >
        {t('template_properties')}
      </CardTitle>
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">{t('name')}</p>
          <p className="text-sm font-medium">{template.name}</p>
        </div>

        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">{t('language')}</p>
          <p className="text-sm font-medium">{template.language}</p>
        </div>

        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">{t('category')}</p>
          <p className="text-sm font-medium">{template.category}</p>
        </div>

        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">{t('status')}</p>
          <Badge variant={statusVariant[template.status] ?? 'outline'}>{template.status}</Badge>
        </div>

        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">{t('created_at')}</p>
          <p className="text-sm font-medium">{template.created_at}</p>
        </div>

        {template.components && template.components.length > 0 && (
          <div className="space-y-3 border-t pt-2">
            <p className="text-muted-foreground text-sm font-medium">{t('components')}</p>
            {template.components.map((component) => (
              <div key={component.id} className="space-y-1 rounded-md border p-3 text-xs">
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
                {component.text && <p className="text-muted-foreground line-clamp-3">{component.text}</p>}
                {component.whatsapp_template_variables?.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <p className="text-muted-foreground">{t('variables_count', { count: component.whatsapp_template_variables.length })}</p>
                    <ul className="text-muted-foreground list-inside list-disc">
                      {component.whatsapp_template_variables.map((v) => (
                        <li key={v.id}>
                          {v.name}
                          {v.example_value ? ` ${t('example_value', { value: v.example_value })}` : ''}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={codeModalIsOpen} close={closeCodeModal} title={t('api_request_example')} className="max-w-2xl">
        <CodeBlock language="json" theme="monokai-sublime" code={buildExamplePayload(template)} />
      </Modal>
    </Card>
  )
}
