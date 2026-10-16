import { useServiceLogin } from '@/services/auth/useServiceAuth'
import Button from '@axolotesource/ui/components/Buttons'
import { ButtonTypeEnum } from '@axolotesource/ui/components/Buttons/enums/buttonType.enum'
import { ButtonVariantEnum } from '@axolotesource/ui/components/Buttons/enums/buttonVariant.enum'
import { Input } from '@axolotesource/ui/components/Form/Input'
import { InputTypeEnum } from '@axolotesource/ui/components/Form/Input/InputType.enum'
import InfoBox from '@axolotesource/ui/components/InfoBox'
import { Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useLoginForm } from './useLoginForm'

const LoginForm = () => {
  const { t } = useTranslation()
  const mutation = useServiceLogin()
  const props = useLoginForm({ mutateAsync: mutation.mutateAsync })

  return (
    <InfoBox className="py-12 dark:bg-black">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-700 dark:text-white">{t('brand_name')}</h1>
        <p className="text-gray-500 dark:text-gray-400">{t('sign_in_subtitle')}</p>
      </div>
      <Formik {...props}>
        {(formik) => (
          <Form className="flex flex-col gap-3">
            <Input name="email" type={InputTypeEnum.Text} label={t('email')} formik={formik} />
            <Input name="password" type={InputTypeEnum.Password} label={t('password')} formik={formik} />
            <Button className="mt-4" type={ButtonTypeEnum.Submit} variant={ButtonVariantEnum.RoundAlt} loading={mutation.isPending}>
              {t('sign_in')}
            </Button>
          </Form>
        )}
      </Formik>
    </InfoBox>
  )
}

export default LoginForm
