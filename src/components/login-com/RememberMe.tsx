import type { ChangeEvent } from 'react'

export interface RememberMeSectionProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  onForgotPassword: () => void
  disabled?: boolean
  className?: string
}

export function RememberMeSection({
  checked,
  onCheckedChange,
  onForgotPassword,
  disabled = false,
  className = '',
}: RememberMeSectionProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onCheckedChange(event.target.checked)
  }

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <label className="flex cursor-pointer items-center gap-2 select-none">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="border-slate-light accent-primary focus-visible:ring-primary h-4 w-4 shrink-0 rounded focus-visible:ring-2 disabled:opacity-50"
        />

        <span className="text-body-md text-grey">Remember Me</span>
      </label>

      <button
        type="button"
        onClick={onForgotPassword}
        disabled={disabled}
        className="text-primary focus-visible:ring-primary hidden rounded-xs text-sm font-medium hover:underline focus:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 md:inline"
      >
        Forgot Password?
      </button>
    </div>
  )
}
