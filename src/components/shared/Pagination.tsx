import { useState } from 'react'
import ChevronRightIcon from '@/assets/ChevronRightIcon.svg?react'
import ChevronLeftIcon from '@/assets/ChevronLeftIcon.svg?react'
interface PaginationProps {
  totalPages: number
}
export function Pagination({ totalPages }: PaginationProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const visiblePages = [1, 2, 3]
  return (
    <nav className="hidden items-center gap-2 md:flex" aria-label="Pagination">
      <button
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="border-slate-light/30 flex h-8 w-8 items-center justify-center rounded-xs border hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </button>

      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          aria-current={currentPage === page ? 'page' : undefined}
          className={`border-slate-light/30 flex h-8 w-8 items-center justify-center rounded-xs border ${
            currentPage === page
              ? 'bg-primary text-white'
              : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}

      <span className="border-slate-light/30 flex h-8 w-8 items-center justify-center rounded-xs border">
        {' '}
        ...
      </span>

      <button
        onClick={() => setCurrentPage(totalPages)}
        aria-current={currentPage === totalPages ? 'page' : undefined}
        className={`border-slate-light/30 flex h-8 w-8 items-center justify-center rounded-xs border ${
          currentPage === totalPages
            ? 'bg-primary text-white'
            : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
        }`}
      >
        {' '}
        {totalPages}
      </button>
      <button
        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="border-slate-light/30 flex h-8 w-8 items-center justify-center rounded-xs border hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRightIcon className="h-4 w-4" />
      </button>
    </nav>
  )
}
