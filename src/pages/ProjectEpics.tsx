import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthenticatedLayout } from '@/components/app-layout/AuthenticatedLayout'
import { EpicDetailsModal } from '@/components/epics-popup/EpicDetailsModal'
import { EpicsHeader } from '@/components/project-epics/EpicsHeader'
import { EpicsList } from '@/components/project-epics/EpicsList'
import { EpicsSkeleton } from '@/components/project-epics/Epicsskeleton'
import { EmptyEpicsState } from '@/components/project-epics/EmptyEpicsState'
import { ErrorState } from '@/components/shared/ErrorState'
import { Pagination } from '@/components/shared/Pagination'
import { useProject } from '@/hooks/useProject'
import { useEpicDetails } from '@/hooks/useEpicDetails'
import { useProjectEpics } from '@/hooks/useProjectEpics'
import { useAddTask } from '@/hooks/useAddTask'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { AddTaskModal } from '@/components/add-task/AddTaskModal'
import type { EpicListItem } from '@/types/epics.types'

export function EpicsPage() {
  const { projectId = '' } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selectedEpic, setSelectedEpic] = useState<EpicListItem | null>(null)
  const epicDetails = useEpicDetails(projectId, selectedEpic?.id ?? null)
  const addTask = useAddTask(projectId)
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
  } = useProjectEpics(projectId, isMobile, false, true, search)
  const sentinelRef = useInfiniteScroll(
    loadMore,
    isMobile &&
      status === 'success' &&
      hasMore &&
      !loadingMore &&
      !loadMoreFailed,
  )
  const projectName = project?.name ?? 'Project'

  return (
    <AuthenticatedLayout projectId={projectId} projectName={projectName}>
      <div className="flex flex-col gap-6 px-6 py-4 md:gap-10 md:px-8 md:py-8">
        <EpicsHeader
          projectName={projectName}
          search={search}
          onSearchChange={(value) => {
            setSearch(value)
            setCurrentPage(1)
          }}
          onNewEpic={() => navigate(`/project/${projectId}/epics/new`)}
        />

        {status === 'loading' && <EpicsSkeleton />}

        {status === 'error' && (
          <ErrorState
            message={error ?? 'Failed to load epics'}
            onRetry={refetch}
          />
        )}

        {status === 'success' && (
          <>
            {epics.length === 0 ? (
              <EmptyEpicsState
                isSearchResult={Boolean(search.trim())}
                onCreateClick={() =>
                  navigate(`/project/${projectId}/epics/new`)
                }
              />
            ) : (
              <EpicsList epics={epics} onEpicClick={setSelectedEpic} />
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
                      className="border-t-primary h-6 w-6 animate-spin rounded-full border-2 border-gray-300"
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
      {selectedEpic && (
        <EpicDetailsModal
          code={epicDetails.epic?.code ?? selectedEpic.code}
          status={epicDetails.status}
          epic={epicDetails.epic}
          error={epicDetails.error}
          onRetry={epicDetails.retry}
          onClose={() => setSelectedEpic(null)}
          onCopyLink={() => {
            void navigator.clipboard.writeText(window.location.href)
          }}
          onAddTask={() => addTask.openAddTask({ epicId: selectedEpic.id })}
        />
      )}
      {addTask.isOpen && <AddTaskModal {...addTask.modalProps} />}
    </AuthenticatedLayout>
  )
}
