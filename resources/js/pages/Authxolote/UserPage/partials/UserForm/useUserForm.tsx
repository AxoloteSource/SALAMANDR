import { useOnSubmit } from '@/hooks/useOnSubmit'
import { IUserType } from '@/interfaces/models/User/user.interface'
import { useServiceStoreUser } from '@/services/authxolote/users/useServiceUsers'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { es } from 'yup-locales'
Yup.setLocale(es)

export interface IInitialValuesUser {
  name: string
  email: string
  role_id: string
  user_type_id: string
  password: string
}

interface IUseUserFormProps {
  onSuccess?: () => void
  userTypes?: IUserType[]
}

export const useUserForm = ({ onSuccess, userTypes = [] }: IUseUserFormProps) => {
  const { t } = useTranslation()
  const humanTypeId = userTypes.find((type) => type.key === 'human')?.id ?? ''

  const initialValues: IInitialValuesUser = {
    name: '',
    email: '',
    role_id: '',
    user_type_id: humanTypeId,
    password: ''
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('name_required')),
    email: Yup.string().email(t('email_invalid')).required(t('email_required')),
    role_id: Yup.string().required(t('role_required')),
    user_type_id: Yup.string().required(t('user_type_required')),
    password: Yup.string().min(8, t('password_min')).required(t('password_is_required'))
  })

  const mutator = useServiceStoreUser()

  const { onSubmit } = useOnSubmit<IInitialValuesUser>({
    mutateAsync: mutator.mutateAsync,
    onSuccess: async () => {
      if (onSuccess) {
        onSuccess()
      }
    }
  })

  const formikProps = {
    validationSchema,
    initialValues,
    onSubmit
  }

  return { formikProps, t }
}
