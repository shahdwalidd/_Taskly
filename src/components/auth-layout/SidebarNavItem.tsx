import type { ComponentType, SVGProps } from 'react'
import { NavLink } from 'react-router-dom'

interface SidebarNavItemProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  label: string
  isActive?: boolean
  isCollapsed?: boolean
  to?: string
  onNavigate?: () => void
}
export function SidebarNavItem({
  icon: Icon,
  label,
  isActive = false,
  isCollapsed = false,
  to,
  onNavigate,
}: SidebarNavItemProps) {
  const className = ({ isActive: isRouteActive }: { isActive: boolean }) =>
    `text-body-md flex items-center gap-3 rounded-sm px-3 py-2.5 font-medium transition-colors ${isCollapsed ? 'justify-center' : 'w-full'} ${isActive || isRouteActive ? 'bg-background text-primary shadow-sm' : 'text-slate-dark hover:bg-surface-low'} `

  if (to) {
    return (
      <NavLink
        to={to}
        end={to === '/project'}
        className={className}
        onClick={onNavigate}
      >
        <Icon className="h-5 w-5 shrink-0" />
        {!isCollapsed && <span className="truncate">{label}</span>}
      </NavLink>
    )
  }

  return (
    <button className={className({ isActive: false })} onClick={onNavigate}>
      <Icon className="h-5 w-5 shrink-0" />
      {!isCollapsed && <span className="truncate">{label}</span>}
    </button>
  )
}
