import themeConfig from '@/theme.config'
import { createSlice } from '@reduxjs/toolkit'
import i18next from 'i18next'

const defaultState = {
  isDarkMode: false,
  mainLayout: 'app',
  theme: 'light',
  menu: 'vertical',
  layout: 'full',
  rtlClass: 'ltr',
  animation: '',
  navbar: 'navbar-sticky',
  locale: 'en',
  sidebar: false,
  pageTitle: '',
  languageList: [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' }
  ],
  semidark: false
}

const initialState = {
  theme: localStorage.getItem('theme') || themeConfig.theme,
  menu: localStorage.getItem('menu') || themeConfig.menu,
  layout: localStorage.getItem('layout') || themeConfig.layout,
  rtlClass: localStorage.getItem('rtlClass') || themeConfig.rtlClass,
  animation: localStorage.getItem('animation') || themeConfig.animation,
  navbar: localStorage.getItem('navbar') || themeConfig.navbar,
  locale: localStorage.getItem('i18nextLng') || themeConfig.locale,
  isDarkMode: false,
  sidebar: localStorage.getItem('sidebar') || defaultState.sidebar,
  semidark: localStorage.getItem('semidark') || themeConfig.semidark,
  languageList: [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' }
  ]
}

const themeConfigSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    toggleTheme(state, { payload }) {
      payload = payload || state.theme
      localStorage.setItem('theme', payload)
      state.theme = payload
      if (payload === 'light') {
        state.isDarkMode = false
      } else if (payload === 'dark') {
        state.isDarkMode = true
      } else if (payload === 'system') {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          state.isDarkMode = true
        } else {
          state.isDarkMode = false
        }
      }

      if (state.isDarkMode) {
        document.querySelector('html')?.classList.add('dark')
      } else {
        document.querySelector('html')?.classList.remove('dark')
      }
    },
    toggleMenu(state, { payload }) {
      payload = payload || state.menu
      state.sidebar = false
      localStorage.setItem('menu', payload)
      state.menu = payload
    },
    toggleLayout(state, { payload }) {
      payload = payload || state.layout
      localStorage.setItem('layout', payload)
      state.layout = payload
    },
    toggleRTL(state, { payload }) {
      payload = payload || state.rtlClass
      localStorage.setItem('rtlClass', payload)
      state.rtlClass = payload
      document.querySelector('html')?.setAttribute('dir', state.rtlClass || 'ltr')
    },
    toggleAnimation(state, { payload }) {
      payload = payload || state.animation
      payload = payload?.trim()
      localStorage.setItem('animation', payload)
      state.animation = payload
    },
    toggleNavbar(state, { payload }) {
      payload = payload || state.navbar
      localStorage.setItem('navbar', payload)
      state.navbar = payload
    },
    toggleSemidark(state, { payload }) {
      payload = payload === true || payload === 'true'
      localStorage.setItem('semidark', payload)
      state.semidark = payload
    },
    toggleLocale(state, { payload }) {
      payload = payload || state.locale
      i18next.changeLanguage(payload)
      state.locale = payload
    },
    toggleSidebar(state) {
      state.sidebar = !state.sidebar
    },
    setPageTitle(state, { payload }) {
      document.title = `${payload} | ${i18next.t('brand_name')}`
    },
    syncThemeFromStorage(state, { payload }) {
      if (payload) {
        state.theme = payload
        if (payload === 'light') {
          state.isDarkMode = false
        } else if (payload === 'dark') {
          state.isDarkMode = true
        } else if (payload === 'system') {
          if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            state.isDarkMode = true
          } else {
            state.isDarkMode = false
          }
        }

        if (state.isDarkMode) {
          document.querySelector('html')?.classList.add('dark')
        } else {
          document.querySelector('html')?.classList.remove('dark')
        }
      }
    }
  }
})

export const {
  toggleTheme,
  toggleMenu,
  toggleLayout,
  toggleRTL,
  toggleAnimation,
  toggleNavbar,
  toggleSemidark,
  toggleLocale,
  toggleSidebar,
  setPageTitle,
  syncThemeFromStorage
} = themeConfigSlice.actions

export default themeConfigSlice.reducer
