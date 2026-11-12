import { useOnSubmit } from '@/hooks/useOnSubmit'
import { IPersonalAccessTokenCreated, IPersonalAccessTokenPayload } from '@/interfaces/models/PersonalAccessToken/IPersonalAccessToken'
import { useServiceStorePersonalAccessToken } from '@/services/authxolote/personalAccessTokens/useServicePersonalAccessTokens'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { es } from 'yup-locales'

Yup.setLocale(es)

export interface IInitialValuesPersonalAccessToken {
  name: string
  expires_in: string
}

const initialValues: IInitialValuesPersonalAccessToken = {
  name: '',
  expires_in: '30'
}

interface IUsePersonalAccessTokenFormProps {
  userId: string | null
  onSuccess: (token: IPersonalAccessTokenCreated) => void
}

export const usePersonalAccessTokenForm = ({ userId, onSuccess }: IUsePersonalAccessTokenFormProps) => {
  const { t } = useTranslation()
  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required(t('name_required')),
    expires_in: Yup.string().required(t('token_expiration'))
  })

  const mutator = useServiceStorePersonalAccessToken()

  const { onSubmit } = useOnSubmit<IInitialValuesPersonalAccessToken, IPersonalAccessTokenCreated, IPersonalAccessTokenPayload>({
    mutateAsync: mutator.mutateAsync,
    formatData: (values) => ({
      user_id: String(userId ?? ''),
      name: values.name.trim(),
      expires_in: values.expires_in === 'never' ? null : Number(values.expires_in)
    }),
    onSuccess
  })

  const formikProps = {
    validationSchema,
    initialValues,
    onSubmit
  }

  return { formikProps, t }
}
