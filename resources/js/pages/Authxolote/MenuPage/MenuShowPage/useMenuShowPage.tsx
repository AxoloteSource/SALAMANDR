import { AlertTypeEnum } from '@/enums/types/AlertTypeEnum'
import { IMenuShow } from '@/interfaces/models/Menu/IMenuShow'
import { IMenuItem } from '@/interfaces/models/MenuItem/IMenuItem'
import {
  IReorderMenuItemPayload,
  useServiceDeleteMenuItem,
  useServiceReorderMenuItems,
  useServiceToggleMenuItemRole
} from '@/services/authxolote/menuItems/useServiceMenuItems'
import { useServiceShowAllMenu } from '@/services/authxolote/menus/useServiceMenus'
import { useServiceIndexRoles } from '@/services/authxolote/roles/useServiceRoles'
import { alertSwal } from '@axolotesource/ui/components/AlertSwal/AlertSwal'
import { IOptions } from '@axolotesource/ui/components/Form/Select/interfaces/IOptions'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { MultiValue, SingleValue } from 'react-select'

const flattenForReorder = (items: IMenuItem[], parentId: string | null = null): IReorderMenuItemPayload[] =>
  items.flatMap((item, index) => [{ id: item.id, parent_id: parentId, sort_order: index }, ...flattenForReorder(item.children ?? [], item.id)])

export const useMenuShowPage = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const slug = searchParams.get('slug')
  const enabled = Boolean(slug)
  const [roleId, setRoleId] = useState<string | null>(null)
  const [selectedMenuItem, setSelectedMenuItem] = useState<IMenuItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [orderedState, setOrderedState] = useState<{ menu: IMenuShow | undefined; items: IMenuItem[] }>({
    menu: undefined,
    items: []
  })

  const { data: menu, isLoading, refetch: refetchMenu } = useServiceShowAllMenu(slug ?? '', enabled, roleId)
  const { data: rolesData, isLoading: rolesLoading } = useServiceIndexRoles({ page: 1, limit: 100 })
  const { mutateAsync: deleteMenuItem } = useServiceDeleteMenuItem()
  const { mutateAsync: toggleMenuItemRole } = useServiceToggleMenuItemRole()
  const { mutateAsync: reorderMenuItems, isPending: isReordering } = useServiceReorderMenuItems()

  const orderedItems = orderedState.menu === menu ? orderedState.items : (menu?.items ?? [])

  const roleOptions = useMemo<IOptions[]>(() => (rolesData?.data ?? []).map((role) => ({ value: role.id, label: role.name })), [rolesData])

  const handleEdit = (item: IMenuItem) => {
    setSelectedMenuItem(item)
  }

  const handleToggleRole = (item: IMenuItem) => {
    if (!roleId) {
      return
    }

    toggleMenuItemRole({ id: item.id, roleId, active: !item.has_role }).then(() => refetchMenu())
  }

  const handleReorder = async (nextItems: IMenuItem[]) => {
    if (!menu || isReordering) {
      return
    }

    const previousItems = orderedItems
    setOrderedState({ menu, items: nextItems })

    try {
      await reorderMenuItems({
        menu_id: menu.id,
        items: flattenForReorder(nextItems)
      })
      await refetchMenu()
    } catch {
      setOrderedState({ menu, items: previousItems })
      alertSwal({
        type: AlertTypeEnum.ErrorNotification,
        title: t('menu_reorder_error')
      })
    }
  }

  const handleDelete = async (id: string) => {
    const result = await alertSwal({
      type: AlertTypeEnum.Confirm,
      title: t('confirm_delete_menu_item'),
      text: t('cannot_undo')
    })

    if (result?.isConfirmed) {
      deleteMenuItem(id).then(() => {
        refetchMenu()
        alertSwal({ type: AlertTypeEnum.SuccessNotification })
      })
    }
  }

  const handleCancel = () => {
    setSelectedMenuItem(null)
  }

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleSuccess = () => {
    setSelectedMenuItem(null)
    refetchMenu()
  }

  const handleRoleChange = (newValue: SingleValue<IOptions> | MultiValue<IOptions>) => {
    const value = (newValue as SingleValue<IOptions> | null)?.value
    setRoleId(value != null ? String(value) : null)
  }

  return {
    menu,
    isLoading,
    slug,
    orderedItems,
    roleOptions,
    rolesLoading,
    roleId,
    setRoleId,
    refetchMenu,
    selectedMenuItem,
    setSelectedMenuItem,
    handleEdit,
    handleToggleRole,
    handleReorder,
    handleDelete,
    handleCancel,
    handleSuccess,
    handleRoleChange,
    isModalOpen,
    openModal,
    closeModal
  }
}
