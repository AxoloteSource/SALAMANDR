import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const ForbiddenPage = () => {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-danger text-6xl font-bold">403</p>
      <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Forbidden</h1>
      <Link to="/" className="text-primary underline underline-offset-4">
        {t('go_home')}
      </Link>
    </div>
  )
}

export default ForbiddenPage
