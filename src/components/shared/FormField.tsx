import type { FieldValues, Path, UseFormRegister } from 'react-hook-form'
interface FormFieldProps<T extends FieldValues> {
  label: string
  name: Path<T>
  type?: 'text' | 'email' | 'password'
  placeholder?: string
  hint?: string
  isRequired?: boolean  

  error?: string
  register: UseFormRegister<T>
}

export function FormField<T extends FieldValues>({
  label,
  name,
  type = 'text',
  placeholder,
  hint,
  register,
  error,
   isRequired,
}: FormFieldProps<T>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={name}
        className="text-label-sm text-slate-medium uppercase"
      >
        {label}
          {isRequired && <span className="text-error ml-0.5">*</span>}

      </label>
      <input
        id={name}
        aria-describedby={error ? `${name}-error` : undefined}
        type={type}

        placeholder={placeholder}
        {...register(name)}
        className="text-body-md bg-surface-highest placeholder:text-slate-medium focus:ring-primary w-full rounded-sm px-4 py-3.5 focus:ring-2 focus:outline-none"
      />
      {error ? (
        <span id={`${name}-error`} className="text-label-sm text-error">
          {error}
        </span>
      ) : hint ? (
        <span className="text-slate-medium text-label-sm font-normal">
          {hint}
        </span>
      ) : null}
    </div>
  )
}
