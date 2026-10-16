import { resolveMenuSlug } from '@/configs/menuSlugs'
import { IMenuShow } from '@/interfaces/models/Menu/IMenuShow'
import { useServiceShowMenu } from '@/services/authxolote/menus/useServiceMenus'

/**
 * Shared menu pipeline for the unified host: resolves the per-app slug from the
 * current section and fetches GET {VITE_AUTH_URL}/api/v1/menus/{slug} (IMenuShow).
 *
 * Only fetches when `enabled` (i.e. the user is authenticated) — the menus
 * endpoint requires an auth token, so hitting it while logged out produces 401s
 * (and, via the axios interceptor, redirect loops). `AxoloteUIAppProvider` falls
 * back to the static `configs/menu.config` when there is no menu data.
 *
 * Wraps Jim's menu service (`useServiceShowMenu`); `useMenuV2` is the same call
 * pinned to VITE_MENU_SLUG, so we pass the resolved slug explicitly here.
 */
// The live menu needs a REAL token + permission grants (Authxolote menus are
// `auth:api` + permission-gated). Until real auth lands, keep the static menu
// fallback and don't call the endpoint (a 401 would also wipe the demo session
// via the axios interceptor). Set VITE_ENABLE_LIVE_MENUS=true to turn it on.
const LIVE_MENUS_ENABLED = import.meta.env.VITE_ENABLE_LIVE_MENUS === 'true'

export const useAppMenu = (pathname?: string, enabled = true) => {
  const resolvedPath = pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '/')
  const slug = resolveMenuSlug(resolvedPath)
  const fetchEnabled = enabled && LIVE_MENUS_ENABLED && Boolean(slug)
  const { data, isLoading } = useServiceShowMenu(slug, fetchEnabled)

  return { menu: data as IMenuShow | undefined, isLoading, slug }
}
