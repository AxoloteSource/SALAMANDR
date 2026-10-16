import { useTranslation } from 'react-i18next'

const DashboardPage = () => {
  const { t } = useTranslation()

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{t('dashboard_title')}</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">{t('dashboard_description')}</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {['total_customers', 'active_rewards', 'points_redeemed'].map((key, index) => (
          <div key={key} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t(key)}</p>
            <p className="mt-2 text-3xl font-semibold text-gray-800 dark:text-white">{[1248, 32, 86530][index]}</p>
          </div>
        ))}
      </div>

      <section className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">{t('welcome_back')}</p>
      </section>
    </div>
  )
}

export default DashboardPage
