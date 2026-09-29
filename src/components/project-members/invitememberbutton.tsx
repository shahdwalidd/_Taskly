import InviteIcon from '@/assets/InviteMemberIcon.svg?react'
interface InviteMemberButtonProps {
  onClick: () => void
}
export function InviteMemberButton({ onClick }: InviteMemberButtonProps) {
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className="bg-primary text-button shadow-invite-button hidden shrink-0 cursor-pointer items-center gap-3 rounded-xs px-6 py-3 text-white md:inline-flex"
      >
        <InviteIcon />
        Invite Member
      </button>
      <button
        type="button"
        onClick={onClick}
        aria-label="Invite Member"
        className="bg-gradient shadow-invite-button fixed right-4 bottom-24 flex size-10 cursor-pointer items-center justify-center rounded-lg text-white md:hidden"
      >
        <InviteIcon />
      </button>
    </>
  )
}
