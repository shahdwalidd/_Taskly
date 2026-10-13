import { EpicAvatar } from './EpicAvatar'
import { EpicValueBox } from './EpicValueeBox'

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
          <EpicAvatar name={name} avatarUrl={avatarUrl} />
          <span className="truncate">{name}</span>
        </>
      ) : (
        <span className="text-slate-medium">Unassigned</span>
      )}
    </EpicValueBox>
  )
}
