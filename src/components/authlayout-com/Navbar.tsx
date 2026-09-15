import MenuIcon from '../../assets/icons/Menuicon.svg?react'
import { getInitials } from '../../utils/getInitials'
import { useUser } from '../../hooks/useUser'
interface NavbarProps {
  onMenuClick?: () => void
}
export function Navbar({ onMenuClick }: NavbarProps) {
  const { user, isLoading } = useUser()

  const userName = user?.user_metadata.name ?? ''
  const jobTitle = user?.user_metadata.department ?? ''
  const initials = getInitials(userName)
  return (
    <header className="bg-background border-border-subtle flex items-center justify-between border-b px-6 py-3 md:px-8">
      <div className="flex items-center gap-4 md:hidden">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="flex items-center"
        >
          <MenuIcon className="w-icon-menu-width h-3" />
        </button>
        <span className="text-slate-dark text-logo">TASKLY</span>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <div className="hidden flex-col items-end sm:flex">
          <span className="text-body-sm text-slate-dark font-bold">
            {' '}
            {isLoading ? '...' : userName}
          </span>
          <span className="text-label-xs text-primary text-right uppercase">
            {isLoading ? '...' : jobTitle}
          </span>
        </div>
        <div className="text-button text-background shadow-avatar bg-primary-container flex h-10 w-10 items-center justify-center rounded-md">
          {initials}
        </div>
      </div>
    </header>
  )
}
