import { useModal } from '@/hooks/useModal'
import { useRefreshKey } from '@/hooks/useRefreshKey'
import { IRole } from '@/interfaces/models/Role/IRole'
import { RoutesAuthxolote } from '@/routes/modules/authxolote.routes'
import { useServiceIndexRoles } from '@/services/authxolote/roles/useServiceRoles'
import Button from '@axolotesource/ui/components/Buttons/Button'
import { IFilters } from '@axolotesource/ui/components/Filters/ModalFilter/types'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export interface IFilterSearchRole {
  name: string
  description: string
}

export const useRolePage = () => {
  const { isOpen, open, close } = useModal(false)
  const { t } = useTranslation()
  const [selectedRole, setselectedRole] = useState<IRole | null>(null)
  const filters: IFilters<IFilterSearchRole>[] = [
    {
      property: 'name',
      initialValue: ''
    }
  ]

  const { refreshKey, handleSuccess } = useRefreshKey({ module: 'role', service: useServiceIndexRoles, close })

  const handleEdit = (data: IRole) => {
    open()
    setselectedRole(data)
  }
  const handleOpen = () => {
    open()
    setselectedRole(null)
  }
  const renderersMap = {
    actions: (data: IRole) => {
      return (
        <>
          <div className="flex gap-2">
            <Button onClick={() => handleEdit(data)}>{t('edit')}</Button>
            <Link className="btn btn-primary" to={RoutesAuthxolote.RoleAction + `?roleId=${data.id}`}>
              {t('actions')}
            </Link>
          </div>
        </>
      )
    }
  }

  return {
    isOpen,
    open: handleOpen,
    close,
    filters,
    renderersMap,
    selectedRole,
    refreshKey,
    handleSuccess
  }
}
