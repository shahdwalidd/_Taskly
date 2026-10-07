import SelectIcon from '@/assets/selecticon.svg?react'
interface AssigneeOption {
  label: string
  value: string
}

interface AssigneeSelectProps {
  id: string
  options: AssigneeOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  error?: string
}

export function AssigneeSelect({
  id,
  options,
  value,
  onChange,
  placeholder = 'Select a member...',
  disabled = false,
  error,
}: AssigneeSelectProps) {
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={id} className="text-label-sm text-grey uppercase">
        Assignee
      </label>

      <div className="relative">
        <select
          id={id}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="bg-surface-highest text-slate-dark focus:ring-primary-container h-12 w-full cursor-pointer appearance-none rounded-md px-4 pr-12 text-base transition outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <SelectIcon
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2"
        />
      </div>

      {error && (
        <p id={`${id}-error`} className="text-error text-sm">
          {error}
        </p>
      )}
    </div>
  )
}
