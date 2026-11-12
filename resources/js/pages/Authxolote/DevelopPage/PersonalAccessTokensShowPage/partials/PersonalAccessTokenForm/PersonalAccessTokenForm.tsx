import { Color } from '@/enums/Color'
import { IPersonalAccessTokenCreated } from '@/interfaces/models/PersonalAccessToken/IPersonalAccessToken'
import Button from '@axolotesource/ui/components/Buttons/Button'
import { ButtonTypeEnum } from '@axolotesource/ui/components/Buttons/enums/buttonType.enum'
import { Input } from '@axolotesource/ui/components/Form/Input'
import InputSelect from '@axolotesource/ui/components/Form/Select/Select'
import { IOptions } from '@axolotesource/ui/components/Form/Select/interfaces/IOptions'
import Modal from '@axolotesource/ui/components/Modal/Modal'
import { Form, Formik } from 'formik'
import { useMemo } from 'react'
import { IInitialValuesPersonalAccessToken, usePersonalAccessTokenForm } from './usePersonalAccessTokenForm'

interface IPersonalAccessTokenFormProps {
  userId: string | null
  userName?: string | null
  isOpen: boolean
  close: () => void
  onSuccess: (token: IPersonalAccessTokenCreated) => void
}

export const PersonalAccessTokenForm = ({ userId, userName, isOpen, close, onSuccess }: IPersonalAccessTokenFormProps) => {
  const { formikProps, t } = usePersonalAccessTokenForm({ userId, onSuccess })

  const expirationOptions = useMemo<IOptions[]>(
    () => [
      { value: '7', label: t('token_expiration_7') },
      { value: '30', label: t('token_expiration_30') },
      { value: '60', label: t('token_expiration_60') },
      { value: '90', label: t('token_expiration_90') },
      { value: 'never', label: t('token_expiration_never') }
    ],
    [t]
  )

  return (
    <Modal className="w-full max-w-lg" title={t('create_personal_access_token')} isOpen={isOpen} close={close} closeOnOverlayClick={false}>
      <Formik key={`${userId ?? 'none'}-${isOpen}`} enableReinitialize {...formikProps}>
        {(formik) => (
          <Form className="mb-4 grid grid-cols-12 gap-3">
            {userName && <p className="col-span-12 text-sm text-[var(--text-muted)]">{t('token_for_user', { name: userName })}</p>}
            <Input<IInitialValuesPersonalAccessToken> className="col-span-12" name="name" label={t('token_name')} formik={formik} />
            <InputSelect<IInitialValuesPersonalAccessToken>
              className="col-span-12"
              name="expires_in"
              label={t('token_expiration')}
              formik={formik}
              options={expirationOptions}
              isLoading={false}
              isClearable={false}
            />
            <div className="col-span-12 mt-3 flex justify-between gap-3">
              <Button onClick={close} type={ButtonTypeEnum.Button} color={Color.White}>
                {t('cancel')}
              </Button>
              <Button type={ButtonTypeEnum.Submit} disabled={formik.isSubmitting || !userId}>
                {t('save')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}
