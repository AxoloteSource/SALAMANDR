import { IFilters } from '@axolotesource/ui/components/Filters/ModalFilter/types'
import { useModal } from '@/hooks/useModal'
import { useRefreshKey } from '@/hooks/useRefreshKey'
import { IUser } from '@/interfaces/models/User/user.interface'
import { useServiceIndexUsers } from '@/services/authxolote/users/useServiceUsers'

export interface IFilterSearchUser {
  name: string
  email: string
}

export const useUserPage = () => {
  const { isOpen, open, close } = useModal(false)
  const filters: IFilters<IFilterSearchUser>[] = [
    {
      property: 'name',
      initialValue: ''
    },
    {
      property: 'email',
      initialValue: ''
    }
  ]

  const { refreshKey, handleSuccess } = useRefreshKey({ module: 'user', service: useServiceIndexUsers, close })

  const renderersMap = {
    role: (user: IUser) => user.role?.name ?? ''
  }

  return {
    filters,
    renderersMap,
    isOpen,
    open,
    close,
    refreshKey,
    handleSuccess
  }
}
