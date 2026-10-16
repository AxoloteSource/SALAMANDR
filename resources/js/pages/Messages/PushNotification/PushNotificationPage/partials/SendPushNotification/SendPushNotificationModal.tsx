import Button from '@axolotesource/ui/components/Buttons/Button'
import { ButtonTypeEnum } from '@axolotesource/ui/components/Buttons/enums/buttonType.enum'
import Modal from '@axolotesource/ui/components/Modal/Modal'
import { Tabs } from '@axolotesource/ui/components/Tabs/Tabs'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Select from 'react-select'
import { ActiveTab, useSendPushNotification } from './useSendPushNotification'

interface Props {
  isOpen: boolean
  close: () => void
  pushNotificationId: string | null
  onSuccess: () => void
}

export const SendPushNotificationModal = ({ isOpen, close, pushNotificationId, onSuccess }: Props) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<ActiveTab>('userList')
  const {
    deviceOptions,
    selectedDevices,
    setSelectedDevices,
    devicesLoading,
    userListOptions,
    selectedUserListId,
    setSelectedUserListId,
    userListsLoading,
    handleSend,
    sending
  } = useSendPushNotification({ pushNotificationId, onSuccess })

  const items = [
    {
      id: 'user-list',
      label: t('by_user_list'),
      content: (
        <>
          <label className="block text-sm font-medium">{t('select_user_list')}</label>
          <Select
            value={userListOptions.find((o) => o.value === selectedUserListId) ?? null}
            options={userListOptions}
            isClearable
            isSearchable
            isLoading={userListsLoading}
            placeholder={t('search_list')}
            onChange={(newValue) => setSelectedUserListId(newValue?.value ?? null)}
            menuPortalTarget={document.body}
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 })
            }}
            classNames={{
              control: (state) =>
                `form-input p-0! border-[var(--border)]! bg-[var(--input-background)]! shadow-[var(--input-shadow)] ${state.isFocused ? ' border-[var(--primary)]! shadow-none!' : ''}`,
              menu: () => 'mt-1! p-1! bg-[var(--input-background)]! rounded-lg! shadow-lg! z-[9999]!',
              option: (state) =>
                `cursor-pointer! select-none! rounded-md! p-2! ${
                  state.isSelected
                    ? 'bg-blue-500! text-white!'
                    : state.isFocused
                      ? 'bg-[var(--background)]! text-[var(--text)]!'
                      : 'text-black! dark:text-gray-200!'
                }`,
              placeholder: () => 'text-gray-400! dark:text-white-dark',
              indicatorSeparator: () => 'hidden!',
              menuList: () => 'p-2!',
              input: () => 'text-black! dark:text-white-dark!',
              loadingMessage: () => 'text-gray-600! dark:text-gray-300! p-2!',
              singleValue: () => 'text-black! dark:text-white-dark!',
              clearIndicator: () => 'cursor-pointer! text-gray-400! hover:text-red-500!'
            }}
          />
        </>
      )
    },
    {
      id: 'devices',
      label: t('by_devices'),
      content: (
        <>
          <label className="block text-sm font-medium">{t('select_devices')}</label>
          <Select
            value={selectedDevices}
            options={deviceOptions}
            isMulti
            isSearchable
            isLoading={devicesLoading}
            placeholder={t('select_devices_placeholder')}
            onChange={(newValue: readonly { value: string; label: string; user_id: string }[]) => setSelectedDevices([...newValue])}
            menuPortalTarget={document.body}
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 })
            }}
            classNames={{
              control: (state) =>
                `form-input p-0! border-[var(--border)]! bg-[var(--input-background)]! shadow-[var(--input-shadow)] ${state.isFocused ? ' border-[var(--primary)]! shadow-none!' : ''}`,
              menu: () => 'mt-1! p-1! bg-[var(--input-background)]! rounded-lg! shadow-lg! z-[9999]!',
              option: (state) =>
                `cursor-pointer! select-none! rounded-md! p-2! ${
                  state.isSelected
                    ? 'bg-blue-500! text-white!'
                    : state.isFocused
                      ? 'bg-[var(--background)]! text-[var(--text)]!'
                      : 'text-black! dark:text-gray-200!'
                }`,
              multiValue: () => 'bg-blue-100! dark:bg-blue-900! rounded-md!',
              multiValueLabel: () => 'text-sm! px-1!',
              multiValueRemove: () => 'hover:bg-red-200! dark:hover:bg-red-800! rounded-r-md!',
              placeholder: () => 'text-gray-400! dark:text-white-dark',
              indicatorSeparator: () => 'hidden!',
              menuList: () => 'p-2!',
              input: () => 'text-black! dark:text-white-dark!',
              loadingMessage: () => 'text-gray-600! dark:text-gray-300! p-2!'
            }}
          />
        </>
      )
    }
  ]

  return (
    <Modal isOpen={isOpen} close={close} title={t('send_push_notification')} className="w-full max-w-2xl">
      <div className="space-y-4">
        <Tabs
          items={items}
          activeIndex={activeTab === 'userList' ? 0 : 1}
          onChange={(index) => setActiveTab(index === 0 ? 'userList' : 'devices')}
          panelClassName="!pt-2"
        />

        <div className="flex justify-end gap-2">
          <Button type={ButtonTypeEnum.Button} onClick={close}>
            {t('cancel')}
          </Button>
          <Button
            type={ButtonTypeEnum.Submit}
            loading={sending}
            disabled={activeTab === 'devices' ? selectedDevices.length === 0 : !selectedUserListId}
            onClick={() => handleSend(activeTab)}
          >
            {t('send')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
