interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'password'
  placeholder?: string
  hint?: string
  value: string
  onChange: (value: string) => void
  error?: string
}

export function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  hint,
  value,
  onChange,
  error,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={name}
        className="text-label-sm text-slate-medium uppercase"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="text-body-md bg-surface-highest placeholder:text-slate-medium focus:ring-primary w-full rounded-sm px-4 py-3.5 focus:ring-2 focus:outline-none"
      />
      {error ? (
        <span className="text-label-sm text-error">{error}</span>
      ) : hint ? (
        <span className="text-slate-medium text-[11px] leading-[16.5px] font-normal">
          {hint}
        </span>
      ) : null}
    </div>
  )
}
