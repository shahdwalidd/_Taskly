export interface PasswordRequirement {
  label: string
  isMet: boolean
}

export function getPasswordRequirements(
  password: string,
): PasswordRequirement[] {
  return [
    {
      label: '8-64 characters',
      isMet: password.length >= 8 && password.length <= 64,
    },
    { label: 'Lowercase letter', isMet: /[a-z]/.test(password) },
    { label: 'Uppercase letter', isMet: /[A-Z]/.test(password) },
    { label: 'At least one digit', isMet: /\d/.test(password) },
    {
      label: 'Special character (e.g. !@#$)',
      isMet: /[^A-Za-z0-9]/.test(password),
    },
  ]
}
