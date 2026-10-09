import type { ReactNode } from 'react'

interface TaskFieldProps {
  id: string
  label: string
  children: ReactNode
}

export function TaskField({ id, label, children }: TaskFieldProps) {
  return (
    <div className="flex flex-col gap-3.5">
      <label htmlFor={id} className="text-label-sm text-grey uppercase">
        {label}
      </label>
      {children}
    </div>
  )
}