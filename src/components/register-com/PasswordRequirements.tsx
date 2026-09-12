interface PasswordRequirementsProps {
  password: string
}
export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const requirements = [
    {
      label: 'At least 8 characters',
      met: password.length >= 8,
    },
    {
      label: 'One uppercase, lowercase, and digit',
      met:
        /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password),
    },
    {
      label: 'One special character',
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ]

  return (
    <ul className="bg-surface-medium radius-md hidden gap-1.5 p-4 md:flex md:flex-col">
      {' '}
      {requirements.map((requirement) => (
        <li className="flex items-center gap-2" key={requirement.label}>
          <span
            className={`material-symbols-outlined text-xs ${requirement.met ? 'text-on-success' : 'text-slate-medium'}`}
          >
            {requirement.met ? 'check_circle' : 'radio_button_unchecked'}
          </span>
          <span className="label-sm text-[#434654]">{requirement.label}</span>
        </li>
      ))}
    </ul>
  )
}
