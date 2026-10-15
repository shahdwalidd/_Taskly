import { useEffect, useRef, useState } from 'react'
import { EpicAvatar } from './EpicAvatar'
import { EpicPersonValue } from './EpicPersonValue'

export interface EpicAssigneeOption {
  id: string
  name: string
  avatarUrl?: string
}

interface EpicAssigneeFieldProps {
  name?: string
  avatarUrl?: string
  selectedId: string | null
  options: EpicAssigneeOption[]
  membersStatus: 'loading' | 'error' | 'success'
  isSaving: boolean
  onRetryMembers: () => void
  onChange: (userId: string | null) => void
}

export function EpicAssigneeField({
  name,
  avatarUrl,
  selectedId,
  options,
  membersStatus,
  isSaving,
  onRetryMembers,
  onChange,
}: EpicAssigneeFieldProps) {
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    function handleMouseDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false)
    }

    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [isOpen])

  function select(userId: string | null) {
    setIsOpen(false)
    onChange(userId)
  }

  const optionClass =
    'hover:bg-surface-low flex w-full cursor-pointer items-center gap-2 px-2.5 py-2 text-left text-base md:text-sm'

  return (
    <div
      ref={rootRef}
      className="relative"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && isOpen) {
          event.stopPropagation()
          setIsOpen(false)
        }
      }}
    >
      <button
        type="button"
        aria-label={`Assignee: ${name ?? 'Unassigned'}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={isSaving}
        onClick={() => setIsOpen((open) => !open)}
        className="block w-full cursor-pointer text-left"
      >
        <EpicPersonValue name={name} avatarUrl={avatarUrl} withChevron />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label="Assignee"
          className="border-surface-highest bg-authcard shadow-card absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border py-1"
        >
          <li>
            <button
              type="button"
              role="option"
              aria-selected={selectedId === null}
              onClick={() => select(null)}
              className={`${optionClass} text-slate-medium ${selectedId === null ? 'bg-surface-low' : ''}`}
            >
              Unassigned
            </button>
          </li>

          {membersStatus === 'loading' && (
            <li role="status" className="text-slate-medium px-2.5 py-2 text-sm">
              Loading project members...
            </li>
          )}

          {membersStatus === 'error' && (
            <li className="px-2.5 py-2 text-sm">
              <span role="alert" className="text-slate-medium">
                Unable to load project members.
              </span>
              <button
                type="button"
                onClick={onRetryMembers}
                className="text-primary ml-2 font-semibold underline"
              >
                Retry
              </button>
            </li>
          )}

          {membersStatus === 'success' && options.map((member) => (
            <li key={member.id}>
              <button
                type="button"
                role="option"
                aria-selected={selectedId === member.id}
                onClick={() => select(member.id)}
                className={`${optionClass} text-slate-dark ${selectedId === member.id ? 'bg-surface-low' : ''}`}
              >
                <EpicAvatar name={member.name} avatarUrl={member.avatarUrl} />
                <span className="truncate">{member.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}