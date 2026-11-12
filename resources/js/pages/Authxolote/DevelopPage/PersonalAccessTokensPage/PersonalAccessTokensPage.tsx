import { IUser } from '@/interfaces/models/User/user.interface'
import { RoutesAuthxolote } from '@/routes/modules/authxolote.routes'
import { useServiceIndexAppUsers } from '@/services/authxolote/users/useServiceUsers'
import Button from '@axolotesource/ui/components/Buttons/Button'
import { ButtonTypeEnum } from '@axolotesource/ui/components/Buttons/enums/buttonType.enum'
import { ButtonVariantEnum } from '@axolotesource/ui/components/Buttons/enums/buttonVariant.enum'
import { IFilters } from '@axolotesource/ui/components/Filters/ModalFilter/types'
import { Page } from '@axolotesource/ui/components/Page/Page'
import { DataTableFilter } from '@axolotesource/ui/components/Tables/DataTableFilter/DataTableFilter'
import { SizeEnum } from '@axolotesource/ui/enums/SizeEnum'
import { Eye } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { usePersonalAccessTokensPage } from './usePersonalAccessTokensPage'

interface IFilterAppUsers {
  name: string
  email: string
}

const breadCrumblesItems = [{ to: RoutesAuthxolote.Home, children: 'home' }, { children: 'develop' }, { children: 'personal_access_tokens' }]

const filters: IFilters<IFilterAppUsers>[] = []

const PersonalAccessTokensPage = () => {
  const { t } = useTranslation()
  const { openUserTokens } = usePersonalAccessTokensPage()

  const renderersMap = {
    role: (user: IUser) => user.role?.name ?? '',
    actions: (user: IUser) => (
      <Button type={ButtonTypeEnum.Button} variant={ButtonVariantEnum.Outline} size={SizeEnum.XS} onClick={() => openUserTokens(user)}>
        <Eye size={14} className="mr-1.5" />
        {t('view')}
      </Button>
    )
  }

  return (
    <Page titleTranslation="personal_access_tokens" helpDescription="personal_access_tokens_description" breadCrumblesItems={breadCrumblesItems}>
      <DataTableFilter
        filters={filters}
        onClickNew={() => undefined}
        service={useServiceIndexAppUsers}
        renderersMap={renderersMap}
        withoutFilters
        showNewButton={false}
      />
    </Page>
  )
}

export default PersonalAccessTokensPage
