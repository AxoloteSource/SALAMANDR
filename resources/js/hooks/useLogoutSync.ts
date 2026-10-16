import { useEffect } from 'react'

/**
 * Hook to synchronize logout across multiple browser tabs/windows.
 * When a tab logs out, all other tabs automatically log out as well.
 * @param logout Function to execute when logout is detected from another tab
 */
export const useLogoutSync = (logout: () => void) => {
  useEffect(() => {
    const handleLogoutFromOtherTab = (event: StorageEvent) => {
      if (event.key === 'authToken' && event.newValue === null) {
        logout()
      }

      if (event.key === 'logout-event' && event.newValue === 'true') {
        logout()
        localStorage.removeItem('logout-event')
      }
    }

    window.addEventListener('storage', handleLogoutFromOtherTab)

    return () => {
      window.removeEventListener('storage', handleLogoutFromOtherTab)
    }
  }, [logout])
}
