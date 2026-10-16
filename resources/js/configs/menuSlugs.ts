/**
 * Per-app menu slug resolution for the unified SALAMANDR host (HAG-9).
 *
 * Maps the current route section to the Authxolote menu slug:
 *   '/messages/*' -> VITE_MESSAGES_MENU_SLUG (default 'messages')
 *   '/auth/*'     -> VITE_AUTH_MENU_SLUG (default 'auth')
 *   everything else (rewards shell: '/', '/dashboard', ...) -> VITE_MENU_SLUG (default 'salamandr')
 */
export const resolveMenuSlug = (pathname: string): string => {
  if (pathname.startsWith('/messages')) {
    return import.meta.env.VITE_MESSAGES_MENU_SLUG || 'messages'
  }

  if (pathname.startsWith('/auth')) {
    return import.meta.env.VITE_AUTH_MENU_SLUG || 'auth'
  }

  return import.meta.env.VITE_MENU_SLUG || 'salamandr'
}
