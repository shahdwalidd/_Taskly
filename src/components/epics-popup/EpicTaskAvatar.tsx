import CreatedByIcon from '@/assets/CreatedByIcon.svg?react'
import { useState } from 'react'
import { cn } from '@/utils/cn'
import { getInitials } from '@/utils/getInitials'

const palette = [
  'bg-surface-highest text-slate-dark',
  'bg-darkgreen text-white',
  'bg-primary-container text-white',
]

function pickColor(name: string) {
  const sum = [...name].reduce((total, char) => total + char.charCodeAt(0), 0)
  return palette[sum % palette.length]
}

interface EpicTaskAvatarProps {
  name?: string
  avatarUrl?: string
}

export function EpicTaskAvatar({ name, avatarUrl }: EpicTaskAvatarProps) {
  const [failedAvatarUrl, setFailedAvatarUrl] = useState<string | null>(null)
  const displayName = name?.trim()

  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-full text-[8px] font-bold',
        displayName
          ? pickColor(displayName)
          : 'bg-surface-highest text-slate-medium',
      )}
    >
      {displayName ? (
        getInitials(displayName)
      ) : (
        <CreatedByIcon className="size-3" />
      )}
      {avatarUrl && avatarUrl !== failedAvatarUrl && (
        <img
          src={avatarUrl}
          alt=""
          className="absolute inset-0 size-full object-cover"
          onError={() => setFailedAvatarUrl(avatarUrl)}
        />
      )}
    </span>
  )
}