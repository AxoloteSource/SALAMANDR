import { Color } from '@/enums/Color'
import { AlertTypeEnum } from '@/enums/types/AlertTypeEnum'
import { IPersonalAccessToken, IPersonalAccessTokenCreated } from '@/interfaces/models/PersonalAccessToken/IPersonalAccessToken'
import { IUser } from '@/interfaces/models/User/user.interface'
import { RoutesAuthxolote } from '@/routes/modules/authxolote.routes'
import {
  useServiceDeletePersonalAccessToken,
  useServiceIndexPersonalAccessTokens,
  useServiceRevokePersonalAccessToken
} from '@/services/authxolote/personalAccessTokens/useServicePersonalAccessTokens'
import { alertSwal } from '@axolotesource/ui/components/AlertSwal/AlertSwal'
import { Badge } from '@axolotesource/ui/components/Badge/Badge'
import Button from '@axolotesource/ui/components/Buttons/Button'
import { ButtonVariantEnum } from '@axolotesource/ui/components/Buttons/enums/buttonVariant.enum'
import { SizeEnum } from '@axolotesource/ui/enums/SizeEnum'
import { useDataTable } from '@axolotesource/ui/hooks/useDataTable'
import { useModal } from '@axolotesource/ui/hooks/useModal'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Ban, Trash2 } from 'lucide-react'
import { DataTableColumn } from 'mantine-datatable'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useParams } from 'react-router-dom'

const formatDate = (value: string) => format(new Date(value), "d 'de' MMMM yyyy, HH:mm", { locale: es })

export const usePersonalAccessTokensShowPage = () => {
  const { userId } = useParams<{ userId: string }>()
  const location = useLocation()
  const { t } = useTranslation()
  const { isOpen, open, close } = useModal(false)
  const [createdToken, setCreatedToken] = useState<IPersonalAccessTokenCreated | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)

  const stateUser = (location.state as { user?: IUser } | null)?.user ?? null

  const { data, isLoading, refetch, dataTableProps } = useDataTable({
    service: useServiceIndexPersonalAccessTokens,
    payload: { user_id: userId ?? '' }
  })

  const user = stateUser ?? data?.data?.[0]?.user ?? null
  const displayName = user?.name ?? userId ?? ''

  const { mutateAsync: revokeToken } = useServiceRevokePersonalAccessToken()
  const { mutateAsync: deleteToken } = useServiceDeletePersonalAccessToken()

  const handleRevoke = useCallback(
    async (token: IPersonalAccessToken) => {
      const result = await alertSwal({
        type: AlertTypeEnum.Confirm,
        title: t('token_revoke_title'),
        text: t('token_revoke_confirmation')
      })

      if (!result?.isConfirmed) return

      setPendingId(token.id)
      try {
        await revokeToken(token.id)
        alertSwal({ type: AlertTypeEnum.SuccessNotification, title: t('token_revoked_success') })
        refetch()
      } catch {
        alertSwal({ type: AlertTypeEnum.ErrorNotification, title: t('error_occurred') })
      } finally {
        setPendingId(null)
      }
    },
    [refetch, revokeToken, t]
  )

  const handleDelete = useCallback(
    async (token: IPersonalAccessToken) => {
      const result = await alertSwal({
        type: AlertTypeEnum.Confirm,
        title: t('token_delete_title'),
        text: t('token_delete_confirmation')
      })

      if (!result?.isConfirmed) return

      setPendingId(token.id)
      try {
        await deleteToken(token.id)
        alertSwal({ type: AlertTypeEnum.SuccessNotification, title: t('token_deleted_success') })
        refetch()
      } catch {
        alertSwal({ type: AlertTypeEnum.ErrorNotification, title: t('error_occurred') })
      } finally {
        setPendingId(null)
      }
    },
    [deleteToken, refetch, t]
  )

  const columns = useMemo<DataTableColumn<IPersonalAccessToken>[]>(
    () => [
      { accessor: 'name', title: t('token_name'), sortable: true },
      {
        accessor: 'expires_at',
        title: t('token_expires'),
        sortable: true,
        render: (record) => (record.expires_at ? formatDate(record.expires_at) : t('token_never_expires'))
      },
      {
        accessor: 'revoked',
        title: t('status'),
        sortable: true,
        render: (record) => <Badge variant={record.revoked ? 'danger' : 'success'}>{t(record.revoked ? 'token_revoked' : 'active')}</Badge>
      },
      { accessor: 'created_at', title: t('created_at'), sortable: true, render: (record) => formatDate(record.created_at) },
      {
        accessor: 'actions',
        title: t('actions'),
        render: (record) => (
          <div className="flex gap-2">
            {!record.revoked && (
              <Button
                variant={ButtonVariantEnum.Outline}
                size={SizeEnum.XS}
                color={Color.Warning}
                disabled={pendingId === record.id}
                onClick={() => void handleRevoke(record)}
              >
                <Ban size={14} className="mr-1.5" />
                {t('token_revoke')}
              </Button>
            )}
            <Button
              variant={ButtonVariantEnum.Outline}
              size={SizeEnum.XS}
              color={Color.Danger}
              disabled={pendingId === record.id}
              onClick={() => void handleDelete(record)}
            >
              <Trash2 size={14} className="mr-1.5" />
              {t('delete')}
            </Button>
          </div>
        )
      }
    ],
    [handleDelete, handleRevoke, pendingId, t]
  )

  const tableProps = useMemo(() => ({ ...dataTableProps, columns, noRecordsText: t('personal_access_tokens_empty') }), [columns, dataTableProps, t])

  const handleCreated = (token: IPersonalAccessTokenCreated) => {
    setCreatedToken(token)
    close()
    refetch()
  }

  const breadCrumblesItems = [
    { to: RoutesAuthxolote.Home, children: 'home' },
    { children: 'develop' },
    { to: RoutesAuthxolote.DevelopPersonalAccessTokens, children: 'personal_access_tokens' },
    { children: displayName }
  ]

  const helpDescription = user ? [user.name, user.email].filter(Boolean).join(' · ') : t('personal_access_tokens_description')

  return {
    userId: userId ?? null,
    user,
    isLoading,
    tableProps,
    breadCrumblesItems,
    helpDescription,
    isOpen,
    open,
    close,
    createdToken,
    closeReveal: () => setCreatedToken(null),
    handleCreated
  }
}
