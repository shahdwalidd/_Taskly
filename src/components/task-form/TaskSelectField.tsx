import ChevronIcon from '@/assets/selecticon.svg?react'
import { getInitials } from '@/utils/getInitials'
import { TaskField } from './TaskField'
import type { SelectOption } from '@/types/addTask.types'

interface TaskSelectFieldProps {
  id: string
  label: string
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string 
  withAvatar?: boolean
}
export function TaskSelectField({
  id,
  label,
  options,
  value,
  onChange,
  placeholder,
  withAvatar = false,
}: TaskSelectFieldProps) {
  const selected = options.find((option) => option.value === value)

  return (
    <TaskField id={id} label={label}>
      <div className="border-surface-highest bg-authcard focus-within:ring-primary-container relative flex h-10 items-center gap-2 rounded-md border px-2 text-xs focus-within:ring-2">
        {selected ? (
          <>
            {withAvatar && (
              <span
                aria-hidden="true"
                className="bg-surface-highest text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
              >
                {getInitials(selected.label)}
              </span>
            )}
            <span className="text-slate-dark truncate font-medium">
              {selected.label}
            </span>
          </>
        ) : (
          <span className="text-slate-medium truncate">{placeholder}</span>
        )}

        <ChevronIcon aria-hidden="true" className="text-grey ml-auto shrink-0" />

        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="absolute inset-0 size-full cursor-pointer opacity-0"
        >
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </TaskField>
  )
}