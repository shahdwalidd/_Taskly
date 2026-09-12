import { useState } from 'react'
interface PasswordFieldProps {
  label: string
  name: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  error?: string
  showVisibilityToggle?: boolean

  linkText?: string
  onLinkClick?: () => void
}
export function PasswordField({
  label,
  name,
  placeholder,
  value,
  onChange,
  error,
  linkText,
  onLinkClick,
  showVisibilityToggle = true,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={name}
          className="text-label-sm text-slate-medium uppercase"
        >
          {label}
        </label>

        {linkText && (
          <button
            type="button"
            onClick={onLinkClick}
            className="text-label-sm text-primary hover:underline md:hidden"
          >
            {linkText}
          </button>
        )}
      </div>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="radius-sm text-body-md bg-surface-highest placeholder:text-slate-medium focus:ring-primary w-full px-4 py-3.5 pr-12 focus:ring-2 focus:outline-none"
        />
        {showVisibilityToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-slate-medium absolute top-1/2 right-3 -translate-y-1/2"
          >
            <span className="material-symbols-outlined">
              {showPassword ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        )}
      </div>
      {error && <span className="text-label-sm text-error">{error}</span>}
    </div>
  )
}
