import { ErrorFallback } from '@axolotesource/ui/components/ErrorBoundary/ErrorFallback'
import { PropsWithChildren, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useDispatch, useSelector } from 'react-redux'
import { Toaster } from 'sileo'
import 'sileo/styles.css'
import store, { IRootState } from './store/index'
import {
  syncThemeFromStorage,
  toggleAnimation,
  toggleLayout,
  toggleLocale,
  toggleMenu,
  toggleNavbar,
  toggleRTL,
  toggleSemidark,
  toggleTheme
} from './store/themeConfigSlice'

function App({ children }: PropsWithChildren) {
  const themeConfig = useSelector((state: IRootState) => state.themeConfig)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(toggleTheme(localStorage.getItem('theme') || themeConfig.theme))
    dispatch(toggleMenu(localStorage.getItem('menu') || themeConfig.menu))
    dispatch(toggleLayout(localStorage.getItem('layout') || themeConfig.layout))
    dispatch(toggleRTL(localStorage.getItem('rtlClass') || themeConfig.rtlClass))
    dispatch(toggleAnimation(localStorage.getItem('animation') || themeConfig.animation))
    dispatch(toggleNavbar(localStorage.getItem('navbar') || themeConfig.navbar))
    dispatch(toggleLocale(localStorage.getItem('i18nextLng') || themeConfig.locale))
    dispatch(toggleSemidark(localStorage.getItem('semidark') || themeConfig.semidark))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  // Cross-tab theme synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme' && e.newValue) {
        dispatch(syncThemeFromStorage(e.newValue))
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [dispatch])

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        window.location.reload()
      }}
      onError={(error, info) => {
        console.error('Error capturado por ErrorBoundary:', error, info)
      }}
    >
      <Toaster
        position="top-right"
        options={themeConfig.theme === 'dark' ? {} : { fill: '#000000', styles: { title: 'text-white', description: 'text-white' } }}
      />
      <div
        className={`${(store.getState().themeConfig.sidebar && 'toggle-sidebar') || ''} ${themeConfig.menu} ${themeConfig.layout} ${
          themeConfig.rtlClass
        } bg-background main-section font-nunito relative text-sm font-normal antialiased`}
      >
        {children}
      </div>
    </ErrorBoundary>
  )
}

export default App
