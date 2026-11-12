import { Color } from '@/enums/Color'
import { useAxios } from '@/hooks/useAxios'
import { useModal } from '@/hooks/useModal'
import { useRefreshKey } from '@/hooks/useRefreshKey'
import { IUser } from '@/interfaces/models/User/user.interface'
import { useServiceBanUser, useServiceDeleteUser, useServiceIndexUsers } from '@/services/authxolote/users/useServiceUsers'
import Button from '@axolotesource/ui/components/Buttons/Button'
import { ButtonVariantEnum } from '@axolotesource/ui/components/Buttons/enums/buttonVariant.enum'
import { IFilters } from '@axolotesource/ui/components/Filters/ModalFilter/types'
import { SizeEnum } from '@axolotesource/ui/enums/SizeEnum'
import { Ban, ShieldCheck, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Swal from 'sweetalert2'

export interface IFilterSearchUser {
  name: string
  email: string
}

export const useUserPage = () => {
  const { t } = useTranslation()
  const { user: currentUser } = useAxios()
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

  const { mutateAsync: deleteUser } = useServiceDeleteUser()
  const { mutateAsync: banUser } = useServiceBanUser()
  const { refreshKey, handleSuccess, handleRefetch } = useRefreshKey({ module: 'user', service: useServiceIndexUsers, close })

  const getErrorMessage = (error: unknown) => {
    const err = error as { response?: { data?: { message?: string } } }
    return err.response?.data?.message ?? t('error_occurred')
  }

  const isCurrentUser = (user: IUser) => String(user.id) === String(currentUser?.id)

  const handleDelete = async (user: IUser) => {
    const result = await Swal.fire({
      title: t('delete_user_confirmation'),
      text: t('delete_user_confirmation_text'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: t('yes'),
      cancelButtonText: t('cancel')
    })

    if (!result.isConfirmed) {
      return
    }

    try {
      await deleteUser(String(user.id))
      Swal.fire({
        title: t('user_deleted'),
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
      await handleRefetch()
    } catch (error) {
      Swal.fire({
        title: t('error_occurred'),
        text: getErrorMessage(error),
        icon: 'error'
      })
    }
  }

  const handleBan = async (user: IUser) => {
    const isBanned = Boolean(user.banned_at)

    const result = await Swal.fire({
      title: t(isBanned ? 'unban_user_confirmation' : 'ban_user_confirmation'),
      text: t(isBanned ? 'unban_user_confirmation_text' : 'ban_user_confirmation_text'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: t('yes'),
      cancelButtonText: t('cancel')
    })

    if (!result.isConfirmed) {
      return
    }

    try {
      await banUser(String(user.id))
      Swal.fire({
        title: t(isBanned ? 'user_unbanned' : 'user_banned'),
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
      await handleRefetch()
    } catch (error) {
      Swal.fire({
        title: t('error_occurred'),
        text: getErrorMessage(error),
        icon: 'error'
      })
    }
  }

  const renderersMap = {
    role: (user: IUser) => user.role?.name ?? '',
    actions: (user: IUser) => (
      <div className="flex gap-2">
        {!isCurrentUser(user) && (
          <Button variant={ButtonVariantEnum.Outline} size={SizeEnum.XS} color={Color.Danger} onClick={() => void handleDelete(user)}>
            <Trash2 size={14} className="mr-1.5" />
            {t('delete')}
          </Button>
        )}
        <Button
          variant={ButtonVariantEnum.Outline}
          size={SizeEnum.XS}
          color={user.banned_at ? Color.Success : Color.Warning}
          onClick={() => void handleBan(user)}
        >
          {user.banned_at ? <ShieldCheck size={14} className="mr-1.5" /> : <Ban size={14} className="mr-1.5" />}
          {t(user.banned_at ? 'unban' : 'ban')}
        </Button>
      </div>
    )
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
