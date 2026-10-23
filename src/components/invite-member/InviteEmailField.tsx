import ErrorIcon from '@/assets/erroricon.svg?react'
import MailIcon from '@/assets/MailIcon.svg?react'

interface InviteEmailFieldProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

export function InviteEmailField({
  value,
  onChange,
  error,
}: InviteEmailFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="invite-email"
        className="text-label-sm text-slate-medium uppercase"
      >
        Email address
      </label>

      <div className="relative">
        <input
          id="invite-email"
          type="email"
          autoComplete="email"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Enter email address"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'invite-email-error' : undefined}
          className="bg-surface-highest text-slate-dark placeholder:text-slate-medium/70 focus:ring-primary-container aria-invalid:ring-error h-12 w-full rounded-md pr-12 pl-4 text-base outline-none focus:ring-2 aria-invalid:ring-2"
        />

        <MailIcon
          aria-hidden="true"
          className="text-slate-medium/70 pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2"
        />
      </div>

      {error && (
        <p
          id="invite-email-error"
          role="alert"
          className="text-label-sm text-error flex items-center gap-2 uppercase"
        >
          <ErrorIcon />
          {error}
        </p>
      )}
    </div>
  )
}