import { useOnSubmit } from '@/hooks/useOnSubmit'
import { IMenu, MenuSize } from '@/interfaces/models/Menu/IMenu'
import { useServiceIndexApplications } from '@/services/authxolote/applications/useServiceApplications'
import { useServiceStoreMenu, useServiceUpdateMenu } from '@/services/authxolote/menus/useServiceMenus'
import { IOptions } from '@axolotesource/ui/components/Form/Select/interfaces/IOptions'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { es } from 'yup-locales'
Yup.setLocale(es)

export interface IInitialValuesMenu {
  application_id: string
  name: string
  slug: string
  icon: string
  size: MenuSize
  sort_order: number
  active: boolean
}
const initialValues: IInitialValuesMenu = {
  application_id: '',
  name: '',
  slug: '',
  icon: '',
  size: 'md',
  sort_order: 0,
  active: true
}

interface IUseMenuFormProps {
  selectedMenu?: IMenu | null
  onSuccess?: () => void
}

export const useMenuForm = ({ selectedMenu, onSuccess }: IUseMenuFormProps) => {
  const { t } = useTranslation()
  const { data: applicationsData, isLoading: applicationsLoading } = useServiceIndexApplications({ page: 1, limit: 100 })

  const applicationOptions = useMemo<IOptions[]>(
    () => (applicationsData?.data ?? []).map((application) => ({ value: application.id, label: application.name })),
    [applicationsData]
  )

  const sizeOptions = useMemo<IOptions[]>(
    () => [
      { value: 'sm', label: t('small') },
      { value: 'md', label: t('medium') },
      { value: 'lg', label: t('large') }
    ],
    [t]
  )

  const validationSchema = Yup.object().shape({
    application_id: Yup.string().required(t('application_required')),
    name: Yup.string().required(t('name_required')),
    slug: Yup.string().required(t('slug_required')),
    size: Yup.mixed<MenuSize>().oneOf(['sm', 'md', 'lg']).required(),
    sort_order: Yup.number().integer().min(0)
  })

  const mutator = useServiceStoreMenu()
  const mutatorUpdate = useServiceUpdateMenu(selectedMenu?.id ?? '')

  const { onSubmit } = useOnSubmit<IInitialValuesMenu>({
    mutateAsync: selectedMenu?.id ? mutatorUpdate.mutateAsync : mutator.mutateAsync,
    onSuccess: async () => {
      if (onSuccess) {
        onSuccess()
      }
    }
  })
  const filledValues = {
    ...initialValues,
    application_id: selectedMenu?.application_id ?? '',
    name: selectedMenu?.name ?? '',
    slug: selectedMenu?.slug ?? '',
    icon: selectedMenu?.icon ?? '',
    size: selectedMenu?.size ?? 'md',
    sort_order: selectedMenu?.sort_order ?? 0,
    active: selectedMenu?.active ?? true
  }
  const formikProps = {
    validationSchema,
    initialValues: filledValues,
    onSubmit
  }
  return { formikProps, t, applicationOptions, applicationsLoading, sizeOptions }
}
