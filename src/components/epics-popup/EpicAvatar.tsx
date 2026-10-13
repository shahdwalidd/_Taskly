import { getInitials } from '@/utils/getInitials'

interface EpicAvatarProps {
  name: string
  avatarUrl?: string
}

export function EpicAvatar({ name, avatarUrl }: EpicAvatarProps) {
  return (
    <span className="bg-surface-highest text-primary relative flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full text-[9px] font-bold">
      <span aria-hidden="true">{getInitials(name)}</span>
      {avatarUrl && (
        <img
          src={avatarUrl}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
      )}
    </span>
  )
}