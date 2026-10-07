import ChevronRightIcon from '@/assets/ChevronRightIcon.svg?react'
import ChevronLeftIcon from '@/assets/ChevronLeftIcon.svg?react'
import { cn } from '@/utils/cn'
type PageItem = number | 'ellipsis'

function getVisiblePages(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 1) {
    return []
  }

  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const startPage = currentPage <= 2 ? 2 : Math.max(2, currentPage - 1)
  const endPage =
    currentPage >= totalPages - 1
      ? totalPages - 1
      : Math.min(totalPages - 1, currentPage + 1)
  const pages: PageItem[] = [1]

  if (startPage > 2) {
    pages.push(startPage === 3 ? 2 : 'ellipsis')
  }

  for (let page = startPage; page <= endPage; page += 1) {
    pages.push(page)
  }

  if (endPage < totalPages - 1) {
    pages.push(endPage === totalPages - 2 ? totalPages - 1 : 'ellipsis')
  }

  pages.push(totalPages)
  return pages
}
interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const visiblePages = getVisiblePages(currentPage, totalPages)
  return (
    <nav className="hidden items-center gap-2 md:flex" aria-label="Pagination">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="border-slate-light/30 flex h-8 w-8 items-center justify-center rounded-xs border hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </button>

      {visiblePages.map((page, index) =>
        page === 'ellipsis' ? (
          <span
            key={`ellipsis-${index}`}
            className="border-slate-light/30 flex h-8 w-8 items-center justify-center rounded-xs border"
            aria-hidden="true"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-current={currentPage === page ? 'page' : undefined}
            className={cn(
              'border-slate-light/30 flex h-8 w-8 items-center justify-center rounded-xs border',
              currentPage === page
                ? 'bg-primary text-white'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50',
            )}
          >
            {page}
          </button>
        ),
      )}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="border-slate-light/30 flex h-8 w-8 items-center justify-center rounded-xs border hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRightIcon className="h-4 w-4" />
      </button>
    </nav>
  )
}
