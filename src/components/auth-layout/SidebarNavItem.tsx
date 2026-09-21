import type { ComponentType, SVGProps } from 'react'

interface SidebarNavItemProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  label: string
  isActive?: boolean
  isCollapsed?: boolean
}
export function SidebarNavItem({
  icon: Icon,
  label,
  isActive = false,
  isCollapsed = false,
}: SidebarNavItemProps) {
  return (
    <button
      className={`text-body-md flex items-center gap-3 rounded-sm px-3 py-2.5 font-medium transition-colors ${isCollapsed ? 'justify-center' : 'w-full'} ${isActive ? 'bg-background text-primary shadow-sm' : 'text-slate-dark hover:bg-surface-low'} `}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!isCollapsed && <span className="truncate">{label}</span>}
    </button>
  )
}
