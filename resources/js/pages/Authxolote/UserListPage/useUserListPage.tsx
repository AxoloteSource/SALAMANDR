import { useModal } from '@/hooks/useModal'
import { useRefreshKey } from '@/hooks/useRefreshKey'
import { IUserList } from '@/interfaces/models/UserList/IUserList'
import { useServiceDeleteUserList, useServiceIndexUserLists } from '@/services/authxolote/userLists/useServiceUserLists'
import Button from '@axolotesource/ui/components/Buttons/Button'
import { IFilters } from '@axolotesource/ui/components/Filters/ModalFilter/types'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface IFilterSearchUserList {
  name: string
}

export const useUserListPage = () => {
  const { isOpen, open, close } = useModal(false)
  const { t } = useTranslation()
  const [selectedUserList, setSelectedUserList] = useState<IUserList | null>(null)
  const filters: IFilters<IFilterSearchUserList>[] = [
    {
      property: 'name',
      initialValue: ''
    }
  ]

  const { refreshKey, handleSuccess } = useRefreshKey({ module: 'userList', service: useServiceIndexUserLists, close })
  const { mutateAsync: deleteUserList } = useServiceDeleteUserList()

  const handleEdit = (data: IUserList) => {
    open()
    setSelectedUserList(data)
  }

  const handleOpen = () => {
    open()
    setSelectedUserList(null)
  }

  const handleDeleteAction = (data: IUserList) => () => {
    const confirmed = window.confirm(t('confirm_delete_user_list'))
    if (confirmed) {
      deleteUserList(data.id).then(() => {
        handleSuccess()
      })
    }
  }

  const renderersMap = {
    actions: (data: IUserList) => {
      return (
        <div className="flex gap-2">
          <Button onClick={() => handleEdit(data)}>{t('edit')}</Button>
          <Button onClick={handleDeleteAction(data)}>{t('delete')}</Button>
        </div>
      )
    }
  }

  return {
    isOpen,
    open: handleOpen,
    close,
    filters,
    renderersMap,
    selectedUserList,
    refreshKey,
    handleSuccess
  }
}
