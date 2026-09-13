import { useState } from 'react'
import type { UseFormRegister, FieldValues, Path } from 'react-hook-form'
import eyeOn from '../../assets/icons/eyeon.svg'
import eyeOff from '../../assets/icons/eye-off.svg'
interface PasswordFieldProps<T extends FieldValues> {
  label: string
  name: Path<T>
  placeholder?: string
  error?: string
  showVisibilityToggle?: boolean
  linkText?: string
  onLinkClick?: () => void
  register: UseFormRegister<T>
}
export function PasswordField<T extends FieldValues>({
  label,
  name,
  placeholder,
  register,
  error,
  linkText,
  onLinkClick,
  showVisibilityToggle = true,
}: PasswordFieldProps<T>) {
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
          aria-describedby={error ? `${name}-error` : undefined}
          type={showPassword ? 'text' : 'password'}

          placeholder={placeholder}
          {...register(name)}
          className="text-body-md bg-surface-highest placeholder:text-slate-medium focus:ring-primary w-full rounded-sm px-4 py-3.5 pr-12 focus:ring-2 focus:outline-none"
        />
        {showVisibilityToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-slate-medium absolute top-1/2 right-3 -translate-y-1/2"
          >
            <img
              src={showPassword ? eyeOff : eyeOn}
              alt=""
              className="h-icon-eye-height w-icon-eye-width"
            />
          </button>
        )}
      </div>
      {error && (
        <span id={`${name}-error`} className="text-label-sm text-error">
          {error}
        </span>
      )}{' '}
    </div>
  )
}
