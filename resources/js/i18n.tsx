import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enMessages from './locales/en.json'
import esMessages from './locales/es.json'
import themeConfig from './theme.config'

/**
 * Unified-host i18n (HAG-9 / HAG-14).
 *
 * `locales/en.json` + `locales/es.json` hold the section translations (currently
 * merged from the LaraAxMessages public/locales files; Authxolote keys merge
 * here later). Because section keys are one flat namespace, the host shell keys
 * below intentionally WIN on conflict (brand name, nav labels, menu helpers).
 */
const shellEn = {
  brand_name: 'Salamandr',
  admin: 'Admin',
  logout: 'Log out',
  email: 'Email',
  password: 'Password',
  sign_in: 'Sign in',
  sign_in_subtitle: 'Enter your credentials to continue',
  invalid_email_format: 'Invalid email format',
  the_email_field_is_required: 'The email field is required',
  password_is_required: 'The password field is required',
  home: 'Home',
  dashboard: 'Dashboard',
  menu_1: 'Menu',
  menu_main: 'Main',
  menu_slug_missing: 'No menu configured for this section.',
  welcome_back: 'Welcome back',
  example_home_title: 'Example home page',
  example_home_description: 'This is the example home page rendered inside the default layout with the application menu.',
  dashboard_title: 'Dashboard',
  dashboard_description: 'Overview of the rewards program.',
  total_customers: 'Customers',
  active_rewards: 'Active rewards',
  points_redeemed: 'Points redeemed',
  not_found: 'Page not found',
  go_home: 'Go home'
}

const shellEs: typeof shellEn = {
  brand_name: 'Salamandr',
  admin: 'Administrador',
  logout: 'Cerrar sesión',
  email: 'Correo electrónico',
  password: 'Contraseña',
  sign_in: 'Iniciar sesión',
  sign_in_subtitle: 'Ingresa tus credenciales para continuar',
  invalid_email_format: 'Formato de correo inválido',
  the_email_field_is_required: 'El campo correo es obligatorio',
  password_is_required: 'El campo contraseña es obligatorio',
  home: 'Inicio',
  dashboard: 'Tablero',
  menu_1: 'Menú',
  menu_main: 'Principal',
  menu_slug_missing: 'No hay menú configurado para esta sección.',
  welcome_back: 'Bienvenido de nuevo',
  example_home_title: 'Página de inicio de ejemplo',
  example_home_description: 'Esta es la página de inicio de ejemplo renderizada dentro del layout con el menú de la aplicación.',
  dashboard_title: 'Tablero',
  dashboard_description: 'Resumen del programa de recompensas.',
  total_customers: 'Clientes',
  active_rewards: 'Recompensas activas',
  points_redeemed: 'Puntos canjeados',
  not_found: 'Página no encontrada',
  go_home: 'Ir al inicio'
}

const resources = {
  en: { translation: { ...enMessages, ...shellEn } },
  es: { translation: { ...esMessages, ...shellEs } }
}

void i18n.use(initReactI18next).init({
  resources,
  lng: themeConfig.locale || 'es',
  fallbackLng: 'es',
  interpolation: {
    escapeValue: false
  }
})

export default i18n
