import circle from '../../assets/icons/circle.svg'
import checkcircle from '../../assets/icons/checkcircle.svg'
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
    <ul className="bg-surface-medium hidden gap-1.5 rounded-md p-4 md:flex md:flex-col">
      {' '}
      {requirements.map((requirement) => (
        <li className="flex items-center gap-2" key={requirement.label}>
          <img
            src={requirement.met ? checkcircle : circle}
            alt=""
            className="h-icon-circle w-icon-circle"
          />
          <span className="text-label-sm text-grey">{requirement.label}</span>
        </li>
      ))}
    </ul>
  )
}
