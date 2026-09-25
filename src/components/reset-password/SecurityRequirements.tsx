import CheckIcon from '@/assets/icons/checkcircle.svg?react'
import CircleIcon from '@/assets/icons/circle.svg?react'
import type { PasswordRequirement } from '@/utils/passwordRequirements'

interface SecurityRequirementsProps {
  requirements: PasswordRequirement[]
}

export function SecurityRequirements({
  requirements,
}: SecurityRequirementsProps) {
  return (
    <div className="border-slate-light/10 bg-surface-low/50 gap-4 rounded-sm border p-5">
      <h3 className="text-label-sm text-grey border-slate-light/10 border-b pb-3">
        Security Requirements
      </h3>

      <ul className="mt-3 grid grid-cols-1 gap-y-3 md:grid-cols-2 md:gap-x-8 md:gap-y-3">
        {requirements.map((requirement) => (
          <li
            key={requirement.label}
            className="flex items-center gap-2 text-sm"
          >
            {requirement.isMet ? (
              <CheckIcon className="h-4 w-4 shrink-0" />
            ) : (
              <CircleIcon className="h-4 w-4 shrink-0" />
            )}
            <span
              className={
                requirement.isMet
                  ? 'text-caption text-slate-dark'
                  : 'text-caption text-grey'
              }
            >
              {requirement.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
