import { useTranslation } from 'react-i18next'
import { useServiceShowMenu } from './useServiceMenus'

/**
 * Authxolote menu pipeline for the unified SALAMANDR host.
 *
 * Reads the per-app slug from `import.meta.env.VITE_MENU_SLUG` (Authxolote uses
 * `auth`) and fetches `GET {VITE_AUTH_URL}/api/v1/menus/{slug}` (IMenuShow) via
 * `useServiceShowMenu`, so it can feed `AxoloteUIProvider.menu`.
 */
export const useMenuV2 = () => {
  const { t } = useTranslation()
  const menuSlug = import.meta.env.VITE_MENU_SLUG
  const enabled = Boolean(menuSlug)

  const { data, isLoading } = useServiceShowMenu(menuSlug ?? 'auth', enabled)

  if (!enabled) {
    return { menu: undefined, isLoading: false, missing: true, message: t('menu_slug_missing') }
  }

  return { menu: data, isLoading, missing: false }
}
