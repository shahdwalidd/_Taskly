import { getInitials } from '@/utils/getInitials'
import { EpicValueBox } from './Epicvaluebox'

interface EpicPersonValueProps {
  name?: string
  avatarUrl?: string
  withChevron?: boolean
}

export function EpicPersonValue({
  name,
  avatarUrl,
  withChevron = false,
}: EpicPersonValueProps) {
  return (
    <EpicValueBox withChevron={withChevron}>
      {name && name !== 'Unassigned' ? (
        <>
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
          <span className="truncate">{name}</span>
        </>
      ) : (
        <span className="text-slate-medium">Unassigned</span>
      )}
    </EpicValueBox>
  )
}
