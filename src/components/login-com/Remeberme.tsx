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
          className="sr-only"
        />

        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-xs border transition-colors md:h-4 md:w-4 ${
            checked
              ? 'bg-primary border-primary'
              : 'md:bg-surface-low border-slate-light bg-white'
          } ${disabled ? 'opacity-50' : ''}`}
        >
          {checked && (
            <span className="material-symbols-outlined text-[12px] leading-none text-white">
              check
            </span>
          )}
        </span>

        <span className="text-body-md text-[#434654]">Remember Me</span>
      </label>

      <button
        type="button"
        onClick={onForgotPassword}
        disabled={disabled}
        className="text-primary focus-visible:ring-primary hidden rounded-xs text-[14px] font-medium hover:underline focus:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 md:inline"
      >
        Forgot Password?
      </button>
    </div>
  )
}
