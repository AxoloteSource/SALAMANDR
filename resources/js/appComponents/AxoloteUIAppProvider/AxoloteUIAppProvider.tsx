import { appMenu } from '@/configs/menu.config'
import { useAxios } from '@/hooks/useAxios'
import { IMenuShow } from '@/interfaces/models/Menu/IMenuShow'
import { IRootState } from '@/store'
import {
  toggleAnimation,
  toggleLayout,
  toggleMenu,
  toggleNavbar,
  toggleRTL,
  toggleSemidark,
  toggleSidebar,
  toggleTheme
} from '@/store/themeConfigSlice'
import { AxoloteThemeConfig, AxoloteUIProvider, AxoloteUIValue } from '@axolotesource/ui'
import { PropsWithChildren, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

interface AxoloteUIAppProviderProps {
  children: PropsWithChildren['children']
  /** Live per-app menu from the Authxolote pipeline; falls back to the static menu. */
  menu?: IMenuShow
  /** Logo shown on light backgrounds. */
  logo?: string
  /** Logo shown on dark backgrounds. */
  logoDark?: string
}

const AxoloteUIAppProvider = ({ children, menu, logo, logoDark }: AxoloteUIAppProviderProps) => {
  const themeConfig = useSelector((state: IRootState) => state.themeConfig)
  const dispatch = useDispatch()
  const { user, logout } = useAxios()

  const setThemeConfig = useCallback(
    (patch: Partial<AxoloteThemeConfig>) => {
      if (patch.theme !== undefined) dispatch(toggleTheme(patch.theme))
      if (patch.menu !== undefined) dispatch(toggleMenu(patch.menu))
      if (patch.layout !== undefined) dispatch(toggleLayout(patch.layout))
      if (patch.rtlClass !== undefined) dispatch(toggleRTL(patch.rtlClass))
      if (patch.animation !== undefined) dispatch(toggleAnimation(patch.animation))
      if (patch.navbar !== undefined) dispatch(toggleNavbar(patch.navbar))
      if (patch.semidark !== undefined) dispatch(toggleSemidark(patch.semidark))
    },
    [dispatch]
  )

  const setTheme = useCallback((theme: string) => dispatch(toggleTheme(theme)), [dispatch])

  const value = useMemo<AxoloteUIValue>(
    () => ({
      themeConfig: {
        theme: themeConfig.theme,
        menu: themeConfig.menu,
        layout: themeConfig.layout,
        rtlClass: themeConfig.rtlClass,
        animation: themeConfig.animation,
        navbar: themeConfig.navbar,
        semidark: themeConfig.semidark,
        sidebar: Boolean(themeConfig.sidebar)
      },
      setThemeConfig,
      toggleSidebar: () => dispatch(toggleSidebar()),
      theme: themeConfig.theme,
      setTheme,
      user: user ? { name: user.name, email: user.email, role: user.role } : null,
      logout,
      logo,
      logoDark,
      brandName: 'Salamandr',
      menu: menu ?? appMenu,
      footerLinks: [
        { label: 'Aviso de privacidad', to: '/' },
        { label: 'Términos y condiciones', to: '/' }
      ]
    }),
    [themeConfig, setThemeConfig, setTheme, user, logout, logo, logoDark, dispatch, menu]
  )

  return <AxoloteUIProvider value={value}>{children}</AxoloteUIProvider>
}

export default AxoloteUIAppProvider
