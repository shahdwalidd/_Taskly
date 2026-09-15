import { useEffect } from 'react'
import { SidebarNavItem } from './SidebarNavItem'
import { ProjectAccordion } from './ProjectAccordion'
import LogoIcon from '../../../public/Iconlogo.svg?react'
import FolderIcon from '../../assets/icons/sideBaricons/ProjectsIcon.svg?react'
import StatsIcon from '../../assets/icons/sideBaricons/MyStatisticsIcon.svg?react'
import CloseIcon from '../../assets/icons/sideBaricons/CloseIcon.svg?react'
import LogoutIcon from '../../assets/icons/sideBaricons/LogoutIcon.svg?react'
interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
  projectName?: string
  logout: () => Promise<void>
  isLoggingOut: boolean
  logoutError: string | null
}
export function MobileDrawer({
  isOpen,
  onClose,
  projectName,
  logout,
  isLoggingOut,
  logoutError,
}: MobileDrawerProps) {
  const hasActiveProject = Boolean(projectName)
  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-40 flex md:hidden">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="bg-background absolute top-0 left-0 flex h-full w-full flex-col p-4">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-2">
            <LogoIcon className="w-icon-menu-width h-5" />
            <span className="text-logo text-slate-dark">TASKLY</span>
          </div>
          <button onClick={onClose} aria-label="Close menu" className="p-1">
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto">
          <SidebarNavItem icon={FolderIcon} label="Projects" isActive />
          <SidebarNavItem icon={StatsIcon} label="My Statistics" />

          {hasActiveProject && (
            <>
              <div className="my-2 border-t border-black/10 p-2" />
              <ProjectAccordion projectName={projectName!} />
            </>
          )}
        </div>
        <div className="shrink-0 border-t border-black/10 pt-3">
          {logoutError && (
            <p role="alert" className="text-error px-3 py-2 text-xs">
              {logoutError}
            </p>
          )}
          <button
            onClick={() => void logout()}
            disabled={isLoggingOut}
            className="text-error flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogoutIcon className="h-5 w-5" />
            <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
