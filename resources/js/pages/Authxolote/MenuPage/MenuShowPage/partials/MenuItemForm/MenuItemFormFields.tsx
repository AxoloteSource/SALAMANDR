import { MENU_ICONS } from '@/configs/menuIcons'
import { Color } from '@/enums/Color'
import { IMenuItem } from '@/interfaces/models/MenuItem/IMenuItem'
import { formatIconLabel, normalizeIconName } from '@/utils/iconName'
import Button from '@axolotesource/ui/components/Buttons/Button'
import { ButtonTypeEnum } from '@axolotesource/ui/components/Buttons/enums/buttonType.enum'
import { Input } from '@axolotesource/ui/components/Form/Input'
import { InputTypeEnum } from '@axolotesource/ui/components/Form/Input/InputType.enum'
import { IOptions } from '@axolotesource/ui/components/Form/Select/interfaces/IOptions'
import InputSelect from '@axolotesource/ui/components/Form/Select/Select'
import Switch from '@axolotesource/ui/components/Form/Switch/Switch'
import { Form, Formik } from 'formik'
import { Circle, type LucideIcon } from 'lucide-react'
import { DynamicIcon, iconNames, type IconName } from 'lucide-react/dynamic'
import { components, OptionProps, SingleValue, SingleValueProps } from 'react-select'
import { IInitialValuesMenuItem, useMenuItemForm } from './useMenuItemForm'

/** Iconos sugeridos al abrir el selector; la búsqueda recorre todo el catálogo de Lucide. */
const STATIC_ICONS: Record<string, LucideIcon> = Object.fromEntries(Object.entries(MENU_ICONS).map(([name, icon]) => [normalizeIconName(name), icon]))

const suggestedIconValues = new Set(Object.keys(STATIC_ICONS))

const iconOptions: IOptions[] = iconNames
  .map((name) => ({ value: name, label: formatIconLabel(name) }))
  .sort((a, b) => String(a.label).localeCompare(String(b.label)))

const filterIconOptions = (option: IOptions, inputValue: string): boolean => {
  const query = inputValue.trim().toLowerCase()

  if (!query) {
    return suggestedIconValues.has(String(option.value))
  }

  return String(option.value).toLowerCase().includes(query) || option.label.toLowerCase().includes(query)
}

interface IIconPreviewProps {
  name: string
  className: string
}

const IconPreview = ({ name, className }: IIconPreviewProps) => {
  const StaticIcon = STATIC_ICONS[name]

  if (StaticIcon) {
    return <StaticIcon className={className} />
  }

  return <DynamicIcon name={name as IconName} className={className} fallback={() => <Circle className={className} aria-hidden />} />
}

const IconOption = (props: OptionProps<IOptions, false>) => {
  const { data } = props

  return (
    <components.Option {...props}>
      <div className="flex items-center gap-2">
        <IconPreview name={String(data.value)} className="h-4 w-4 shrink-0" />
        <span>{data.label}</span>
      </div>
    </components.Option>
  )
}

const IconSingleValue = (props: SingleValueProps<IOptions, false>) => {
  const { data } = props

  return (
    <components.SingleValue {...props}>
      <div className="flex items-center gap-2">
        <IconPreview name={String(data.value)} className="h-4 w-4 shrink-0" />
        <span>{data.label}</span>
      </div>
    </components.SingleValue>
  )
}

interface IMenuItemFormFieldsProps {
  onSuccess?: () => void
  onCancel: () => void
  selectedMenuItem?: IMenuItem | null
  menuId?: string
}

export const MenuItemFormFields = ({ selectedMenuItem, onSuccess, onCancel, menuId }: IMenuItemFormFieldsProps) => {
  const { formikProps, t, parentOptions, parentLoading, typeOptions } = useMenuItemForm({
    selectedMenuItem,
    onSuccess,
    menuId
  })

  return (
    <Formik enableReinitialize {...formikProps}>
      {(formik) => (
        <Form className="mb-4 grid grid-cols-12 gap-3 sm:grid-cols-12">
          <InputSelect<IInitialValuesMenuItem>
            className="col-span-12"
            name="type"
            label={`${t('type')}`}
            formik={formik}
            options={typeOptions}
            isLoading={false}
            onChange={(newValue) => {
              const value = (newValue as SingleValue<IOptions> | null)?.value
              if (value === 'header' || value === 'section') {
                formik.setFieldValue('route', '')
                formik.setFieldValue('path', '')
              }
            }}
          />
          <InputSelect<IInitialValuesMenuItem>
            className="col-span-12"
            name="parent_id"
            label={`${t('parent_item')}`}
            formik={formik}
            options={parentOptions}
            isLoading={parentLoading}
            onChange={(newValue) => {
              const value = (newValue as SingleValue<IOptions> | null)?.value
              formik.setFieldValue('parent_id', value != null ? String(value) : '')
            }}
          />
          <Input<IInitialValuesMenuItem> className="col-span-6" name="name" type={InputTypeEnum.Text} label={`${t('name')}`} formik={formik} />
          <Input<IInitialValuesMenuItem> className="col-span-6" name="slug" type={InputTypeEnum.Text} label={`${t('slug')}`} formik={formik} />
          {formik.values.type === 'link' && (
            <>
              <Input<IInitialValuesMenuItem> className="col-span-6" name="path" type={InputTypeEnum.Text} label={`${t('path')}`} formik={formik} />
              <Input<IInitialValuesMenuItem> className="col-span-6" name="route" type={InputTypeEnum.Text} label={`${t('route')}`} formik={formik} />
            </>
          )}
          {formik.values.type !== 'section' && (
            <InputSelect<IInitialValuesMenuItem>
              className="col-span-12"
              name="icon"
              label={`${t('icon')}`}
              formik={formik}
              options={iconOptions}
              isLoading={false}
              isSearchable
              isClearable
              filterOption={filterIconOptions}
              noOptionsMessage="Sin resultados"
              OptionComponent={IconOption}
              SingleValueComponent={IconSingleValue}
            />
          )}
          <Input<IInitialValuesMenuItem>
            className="col-span-12"
            name="sort_order"
            type={InputTypeEnum.Number}
            label={`${t('sort_order')}`}
            formik={formik}
          />
          <div className="col-span-12">
            <Switch<IInitialValuesMenuItem> name="active" label={t('active')} formik={formik} />
          </div>
          <div className="col-span-12 mt-3 flex justify-between gap-3">
            <Button className="col-span-12 md:col-span-6" onClick={onCancel} type={ButtonTypeEnum.Button} color={Color.White}>
              {t('cancel')}
            </Button>
            <Button className="col-span-12 md:col-span-6" type={ButtonTypeEnum.Submit} disabled={formik.isSubmitting}>
              {t('save')}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  )
}
