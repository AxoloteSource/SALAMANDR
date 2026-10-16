import { IEmail } from '@/services/messages/interfaces/IEmail'
import { useTranslation } from 'react-i18next'

export const useEmailPage = () => {
  const { t } = useTranslation()

  const renderersMap = {
    variables: (record: IEmail) =>
      record && (
        <span>
          {record.variables.length} {t('variables')}
        </span>
      ),
    actions: () => null
  }

  return {
    filters: [],
    renderersMap
  }
}
