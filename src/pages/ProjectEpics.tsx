
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthenticatedLayout } from '@/components/app-layout/AuthenticatedLayout'
import { EpicsHeader } from '@/components/project-epics/EpicsHeader'
import { EpicsList } from '@/components/project-epics/EpicsList'
import { EpicsSkeleton } from '@/components/project-epics/Epicsskeleton'
import { EmptyEpicsState } from '@/components/project-epics/EmptyEpicsState'
import { ErrorState } from '@/components/shared/ErrorState'
import { Pagination } from '@/components/shared/Pagination'
import { useProject } from '@/hooks/useProject'
import { useProjectEpics } from '@/hooks/useProjectEpics'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

export function EpicsPage() {
  const { projectId = '' } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const isMobile = !useMediaQuery('(min-width: 768px)')
  const { project } = useProject(projectId)
  const {
    epics,
    status,
    error,
    refetch,
    currentPage,
    totalPages,
    setCurrentPage,
    loadMore,
    loadingMore,
    loadMoreFailed,
    hasMore,
  } = useProjectEpics(projectId, isMobile)
  const sentinelRef = useInfiniteScroll(
    loadMore,
    isMobile &&
      status === 'success' &&
      hasMore &&
      !loadingMore &&
      !loadMoreFailed,
  )
  const projectName = project?.name ?? 'Project'

  const filteredEpics = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return epics
    }

    return epics.filter(
      (epic) =>
        epic.title.toLowerCase().includes(query) ||
        epic.assigneeName.toLowerCase().includes(query) ||
        epic.code.toLowerCase().includes(query),
    )
  }, [epics, search])

  return (
    <AuthenticatedLayout projectId={projectId} projectName={projectName}>
      <div className="flex flex-col gap-6 px-6 py-4 md:gap-10 md:px-8 md:py-8">
        {status === 'loading' && <EpicsSkeleton />}

        {status === 'error' && (
          <ErrorState
            message={error ?? "We're having trouble retrieving your epics right now. Please try again."}
            onRetry={refetch}
          />
        )}

        {status === 'success' && (
          <>
            <EpicsHeader
              projectName={projectName}
              search={search}
              onSearchChange={setSearch}
              onNewEpic={() => navigate(`/project/${projectId}/epics/new`)}
            />

            {epics.length === 0 ? (
              <EmptyEpicsState
                onCreateClick={() => navigate(`/project/${projectId}/epics/new`)}
              />
            ) : filteredEpics.length > 0 ? (
              <EpicsList epics={filteredEpics} />
            ) : (
              <div className="text-grey flex min-h-56 flex-col items-center justify-center gap-2 text-center">
                <h2 className="text-slate-dark text-lg font-semibold">
                  No matching epics
                </h2>
                <p className="text-sm">
                  Try a different search term.
                </p>
              </div>
            )}

            <div className="flex justify-end pt-4 md:pt-8">
               {!isMobile && (
              <div className="mt-12 flex justify-end">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}

            {isMobile && (
              <div className="mt-8 flex flex-col items-center gap-3">
                {hasMore && <div ref={sentinelRef} className="h-1 w-full" />}

                {loadingMore && (
                  <div
                    role="status"
                    aria-label="Loading more epics"
                    className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-primary"
                  />
                )}

                {loadMoreFailed && (
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm text-gray-600">
                      Failed to load epics
                    </p>
                    <button
                      onClick={loadMore}
                      className="rounded-xs border border-gray-200 px-4 py-2 text-sm"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>
              )}
            </div>
          </>
        )}
      </div>
    </AuthenticatedLayout>
  )
}