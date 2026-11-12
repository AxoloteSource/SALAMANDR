import Button from '@axolotesource/ui/components/Buttons/Button'
import { ButtonTypeEnum } from '@axolotesource/ui/components/Buttons/enums/buttonType.enum'
import Card from '@axolotesource/ui/components/Card'
import { Page } from '@axolotesource/ui/components/Page/Page'
import { DataTable } from '@axolotesource/ui/components/Tables/DataTable/DataTable'
import type { IDataTableCustomProps } from '@axolotesource/ui/components/Tables/DataTable/IDataTableCustomProps'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PersonalAccessTokenForm } from './partials/PersonalAccessTokenForm/PersonalAccessTokenForm'
import { PersonalAccessTokenReveal } from './partials/PersonalAccessTokenReveal/PersonalAccessTokenReveal'
import { usePersonalAccessTokensShowPage } from './usePersonalAccessTokensShowPage'

const PersonalAccessTokensShowPage = () => {
  const { t } = useTranslation()
  const { userId, user, isLoading, tableProps, breadCrumblesItems, helpDescription, isOpen, open, close, createdToken, closeReveal, handleCreated } =
    usePersonalAccessTokensShowPage()

  return (
    <Page
      titleTranslation="personal_access_tokens"
      helpDescription={helpDescription}
      breadCrumblesItems={breadCrumblesItems}
      headerAction={
        <Button type={ButtonTypeEnum.Button} disabled={!userId} onClick={open}>
          <Plus size={16} className="mr-1.5" />
          {t('create_personal_access_token')}
        </Button>
      }
    >
      <Card>
        <DataTable datatablePros={tableProps as IDataTableCustomProps['datatablePros']} isLoading={isLoading} />
      </Card>

      <PersonalAccessTokenForm userId={userId} userName={user?.name} isOpen={isOpen} close={close} onSuccess={handleCreated} />
      <PersonalAccessTokenReveal key={createdToken?.id ?? 'none'} token={createdToken} onClose={closeReveal} />
    </Page>
  )
}

export default PersonalAccessTokensShowPage
