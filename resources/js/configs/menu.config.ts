import { IMenuShow } from '@/interfaces/models/Menu/IMenuShow'

/**
 * Static fallback menu for the shell sidebar (used when the per-app menu API
 * returns nothing / the user is not authenticated).
 *
 * Kept as flat top-level LINKS (not a collapsed header) so the entries are
 * directly clickable. The live menu comes from the Authxolote pipeline
 * (GET {VITE_AUTH_URL}/api/v1/menus/{slug}) via `hooks/useAppMenu`.
 */
export const appMenu: IMenuShow = {
  id: 'salamandr-main',
  application_id: 'salamandr',
  application: 'Salamandr',
  name: 'Main',
  slug: 'main',
  icon: null,
  sort_order: 1,
  active: true,
  items_count: 2,
  created_at: new Date(0).toISOString(),
  items: [
    {
      id: 'item-home',
      menu_id: 'salamandr-main',
      parent_id: null,
      type: 'link',
      name: 'home',
      slug: 'home',
      route: '/',
      path: '/',
      icon: 'House',
      sort_order: 1,
      active: true,
      children: [],
      created_at: new Date(0).toISOString()
    },
    {
      id: 'item-dashboard',
      menu_id: 'salamandr-main',
      parent_id: null,
      type: 'link',
      name: 'dashboard',
      slug: 'dashboard',
      route: '/dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      sort_order: 2,
      active: true,
      children: [],
      created_at: new Date(0).toISOString()
    }
  ]
}
