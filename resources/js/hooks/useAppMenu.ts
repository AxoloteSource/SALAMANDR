import { IMenuShow } from '@/interfaces/models/Menu/IMenuShow'
import { useServiceShowMenu } from '@/services/authxolote/menus/useServiceMenus'

/**
 * Unified menu pipeline (HAG-19).
 *
 * SALAMANDR renders ONE unified menu (application slug `salamandr`) that already
 * holds the `/auth/*` and `/messages/*` groups as nested items; the Authxolote
 * menus endpoint is auth-gated. So:
 *   - one slug: VITE_MENU_SLUG (default 'salamandr'); no per-section resolver.
 *   - fetch only when authenticated AND VITE_ENABLE_LIVE_MENUS=true.
 * `AxoloteUIAppProvider` falls back to the static `configs/menu.config` when no
 * menu data is available.
 */
const MENU_SLUG = import.meta.env.VITE_MENU_SLUG || 'salamandr'
const LIVE_MENUS_ENABLED = import.meta.env.VITE_ENABLE_LIVE_MENUS === 'true'

export const useAppMenu = (enabled = true) => {
  const fetchEnabled = enabled && LIVE_MENUS_ENABLED
  const { data, isLoading } = useServiceShowMenu(MENU_SLUG, fetchEnabled)

  return { menu: data as IMenuShow | undefined, isLoading, slug: MENU_SLUG }
}
