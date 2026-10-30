import { useServiceIndexEmails } from '@/services/messages/email/useServiceEmail'
import { Page } from '@axolotesource/ui/components/Page/Page'
import { DataTableFilter } from '@axolotesource/ui/components/Tables/DataTableFilter/DataTableFilter'
import { useEmailPage } from './useEmailPage'

const EmailPage = () => {
  const { filters, renderersMap } = useEmailPage()

  return (
    <Page titleTranslation="emails">
      <DataTableFilter filters={filters} showNewButton={false} onClickNew={() => {}} service={useServiceIndexEmails} renderersMap={renderersMap} />
    </Page>
  )
}

export default EmailPage
