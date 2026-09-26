import ArrowIcon from '@/assets/Arrowicon.svg?react'
import { cn } from '@/utils/cn'
interface BreadcrumbItem {
  label: string
  isActive?: boolean
}

interface PageBreadcrumbProps {
  items: BreadcrumbItem[]
}

export function PageBreadcrumb({ items }: PageBreadcrumbProps) {
  return (
    <nav className="hidden items-center gap-2 md:flex">
      {items.map((item, index) => (
        <span key={item.label} className="flex items-center gap-2">
          {index > 0 && <ArrowIcon className="h-icon-xs-height w-icon-xs" />}
          <span
            className={cn(
              'text-span-sm uppercase',
              item.isActive ? 'text-primary' : 'text-overlay-dark',
            )}
          >
            {item.label}
          </span>
        </span>
      ))}
    </nav>
  )
}
