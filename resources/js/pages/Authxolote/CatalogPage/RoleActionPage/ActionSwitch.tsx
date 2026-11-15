import { IAction } from '@/interfaces/models/Actions/IAction'
import { useServiceUpdateRoleAction } from '@/services/authxolote/roleActions/useServiceRoleActions'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { sileo } from 'sileo'
import { ActionToggle } from './partials/ActionToggle'

export const ActionSwitch = ({ data }: { data: IAction }) => {
  const [searchParams] = useSearchParams()
  const roleId = searchParams.get('roleId')
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [optimisticActive, setOptimisticActive] = useState<boolean | null>(null)
  const checked = optimisticActive ?? data.active
  const mutation = useServiceUpdateRoleAction(roleId!, data.id)

  const handleChange = (newValue: boolean) => {
    setOptimisticActive(newValue)

    mutation.mutate(
      { active: newValue },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [`/api/v1/roles/${roleId}/actions`] })
        },
        onError: (error) => {
          setOptimisticActive(null)
          const err = error as { response?: { data?: { message?: string } } }
          sileo.error({
            title: 'Error',
            description: err.response?.data?.message ?? t('error_occurred')
          })
        }
      }
    )
  }

  return <ActionToggle checked={checked} disabled={mutation.isPending} label={checked ? t('active') : t('inactive')} onChange={handleChange} />
}
