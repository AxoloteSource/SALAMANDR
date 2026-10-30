import { RoutesAuthxolote } from '@/routes/modules/authxolote.routes'
import Card from '@axolotesource/ui/components/Card/Card'
import { Page } from '@axolotesource/ui/components/Page/Page'
import Typography from '@axolotesource/ui/components/Typography'
import { TypographyVariantEnum } from '@axolotesource/ui/components/Typography/enums/typographyVariant.enum'
import { CreditCard } from 'lucide-react'
import { NavLink } from 'react-router-dom'

interface UiComponentItem {
  name: string
  path: string
  icon: React.ReactNode
  description: string
}

const uiComponents: UiComponentItem[] = [
  {
    name: 'Pricing Card',
    path: RoutesAuthxolote.UiPricingCard,
    icon: <CreditCard className="h-5 w-5" />,
    description: 'Pricing tables with basic, toggle, and animated variants'
  }
]

const breadCrumblesItems = [{ children: 'UI Components' }]

const UiPage = () => {
  return (
    <Page titleTranslation="UI Components" breadCrumblesItems={breadCrumblesItems}>
      <div className="space-y-6">
        <Typography variant={TypographyVariantEnum.H3} className="font-semibold">
          Available Components
        </Typography>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {uiComponents.map((component) => (
            <NavLink key={component.path} to={component.path} className="block">
              <Card className="hover:ring-primary/50 !p-6 transition-all duration-200 hover:shadow-lg hover:ring-2">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-lg">{component.icon}</div>
                  <div>
                    <Typography variant={TypographyVariantEnum.H4} className="font-semibold">
                      {component.name}
                    </Typography>
                    <p className="text-white-dark mt-1 text-sm">{component.description}</p>
                  </div>
                </div>
              </Card>
            </NavLink>
          ))}
        </div>
      </div>
    </Page>
  )
}

export default UiPage
