interface IActionToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-4 w-8',
  md: 'h-6 w-12',
  lg: 'h-8 w-16'
}

const thumbClasses = {
  sm: 'before:h-2.5 before:w-2.5 before:bottom-0.5 before:left-0.5 peer-checked:before:left-4.5',
  md: 'before:h-4 before:w-4 before:bottom-1 before:left-1 peer-checked:before:left-7',
  lg: 'before:h-6 before:w-6 before:bottom-1 before:left-1 peer-checked:before:left-9'
}

export const ActionToggle = ({ checked, onChange, disabled = false, label, size = 'md' }: IActionToggleProps) => {
  return (
    <label className="dark:text-white-dark mb-0 flex w-fit cursor-pointer items-center gap-2 font-normal text-gray-800">
      <span className={`relative block shrink-0 ${sizeClasses[size]}`}>
        <input
          type="checkbox"
          role="switch"
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange(event.currentTarget.checked)}
          className="peer absolute z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        />
        <span
          aria-hidden="true"
          className={`peer-checked:bg-primary peer-checked:peer-hover:bg-primary-dark peer-focus:ring-primary/30 dark:bg-dark dark:before:bg-white-dark block h-full rounded-full bg-gray-300 transition-all duration-300 ease-in-out peer-focus:ring-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 before:absolute before:rounded-full before:bg-white before:shadow-sm before:transition-all before:duration-300 before:ease-in-out dark:peer-checked:before:bg-white ${thumbClasses[size]}`}
        />
      </span>
      {label && <span className="text-sm">{label}</span>}
    </label>
  )
}
