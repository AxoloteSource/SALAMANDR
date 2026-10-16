import { useTranslation } from 'react-i18next'

const highlights = [
  { key: 'total_customers', value: '1,248' },
  { key: 'active_rewards', value: '32' },
  { key: 'points_redeemed', value: '86,530' }
]

const HomePage = () => {
  const { t } = useTranslation()

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{t('example_home_title')}</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">{t('example_home_description')}</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map((item) => (
          <div key={item.key} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t(item.key)}</p>
            <p className="mt-2 text-3xl font-semibold text-gray-800 dark:text-white">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HomePage
