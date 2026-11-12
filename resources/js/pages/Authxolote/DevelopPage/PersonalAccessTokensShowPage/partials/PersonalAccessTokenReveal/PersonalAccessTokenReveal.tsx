import { IPersonalAccessTokenCreated } from '@/interfaces/models/PersonalAccessToken/IPersonalAccessToken'
import Alert from '@axolotesource/ui/components/Alert'
import Button from '@axolotesource/ui/components/Buttons/Button'
import { ButtonTypeEnum } from '@axolotesource/ui/components/Buttons/enums/buttonType.enum'
import { ButtonVariantEnum } from '@axolotesource/ui/components/Buttons/enums/buttonVariant.enum'
import Modal from '@axolotesource/ui/components/Modal/Modal'
import { SizeEnum } from '@axolotesource/ui/enums/SizeEnum'
import { Check, ClipboardCopy } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface IPersonalAccessTokenRevealProps {
  token: IPersonalAccessTokenCreated | null
  onClose: () => void
}

export const PersonalAccessTokenReveal = ({ token, onClose }: IPersonalAccessTokenRevealProps) => {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  const copyToken = async () => {
    if (!token) return

    try {
      await navigator.clipboard.writeText(token.token)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Modal className="w-full max-w-2xl" title={t('token_created_title')} isOpen={!!token} close={onClose} closeOnOverlayClick={false}>
      {token && (
        <div className="space-y-4">
          <Alert type="warning">{t('token_created_warning')}</Alert>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <span className="mb-1.5 block text-xs font-semibold tracking-wide text-[var(--text-muted)] uppercase">{t('token_name')}</span>
              <p className="text-sm text-[var(--text)]">{token.name}</p>
            </div>
            <div>
              <span className="mb-1.5 block text-xs font-semibold tracking-wide text-[var(--text-muted)] uppercase">{t('token_expires_at')}</span>
              <p className="text-sm text-[var(--text)]">
                {token.expires_at ? new Date(token.expires_at).toLocaleString() : t('token_never_expires')}
              </p>
            </div>
          </div>

          <div>
            <span className="mb-1.5 block text-xs font-semibold tracking-wide text-[var(--text-muted)] uppercase">
              {t('token_for_user', { name: token.user?.name ?? '' })}
            </span>
            <p className="text-sm text-[var(--text)]">{token.user?.email}</p>
          </div>

          <div>
            <span className="mb-1.5 block text-xs font-semibold tracking-wide text-[var(--text-muted)] uppercase">{t('token_label')}</span>
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <input
                  readOnly
                  type="password"
                  value={token.token}
                  aria-label={t('token_label')}
                  autoComplete="off"
                  spellCheck={false}
                  className="form-input font-mono text-sm"
                />
              </div>
              <Button type={ButtonTypeEnum.Button} variant={ButtonVariantEnum.Outline} size={SizeEnum.XS} onClick={() => void copyToken()}>
                {copied ? <Check size={14} className="mr-1.5" /> : <ClipboardCopy size={14} className="mr-1.5" />}
                {t(copied ? 'token_copied' : 'copy_token')}
              </Button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type={ButtonTypeEnum.Button} onClick={onClose}>
              {t('token_saved')}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
