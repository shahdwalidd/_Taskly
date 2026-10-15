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
import { useEditEpic } from '@/hooks/useEditEpic'
import { useProjectMembers } from '@/hooks/useProjectMembers'
import { useProjectEpics } from '@/hooks/useProjectEpics'
import { useDebounce } from '@/hooks/useDebounce'
import { useAddTask } from '@/hooks/useAddTask'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { AddTaskModal } from '@/components/add-task/AddTaskModal'
import type { EpicListItem } from '@/types/epics.types'

export function EpicsPage() {
  const { projectId = '' } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [selectedEpic, setSelectedEpic] = useState<EpicListItem | null>(null)
  const projectMembers = useProjectMembers(projectId)
  const { members } = projectMembers
  const addTask = useAddTask(projectId)
  const isMobile = !useMediaQuery('(min-width: 768px)')
  const { project } = useProject(projectId)
  const {
    epics,
    updateEpic,
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
  } = useProjectEpics(projectId, isMobile, false, true, debouncedSearch)
  const epicDetails = useEpicDetails(projectId, selectedEpic?.id ?? null)
  const epicEditor = useEditEpic(
    selectedEpic?.id ?? null,
    epicDetails.updateEpicDetails,
    updateEpic,
  )
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
          showBreadcrumb={status !== 'loading'}
          search={search}
          onSearchChange={setSearch}
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
                isSearchResult={Boolean(debouncedSearch.trim())}
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
          onTitleChange={(title) =>
            void epicEditor.saveField(
              'title',
              { title },
              { title },
              { title: epicDetails.epic?.title ?? '' },
            )
          }
          onDescriptionChange={(description) => {
            const value = description === '' ? null : description
            void epicEditor.saveField(
              'description',
              { description: value },
              { description: value ?? undefined },
              { description: epicDetails.epic?.description },
            )
          }}
          assigneeOptions={members.map((member) => ({
            id: member.id,
            name: member.name,
            avatarUrl: member.avatarUrl,
          }))}
          membersStatus={projectMembers.status}
          onRetryMembers={projectMembers.refetch}
          savingFields={epicEditor.savingFields}
          onAssigneeChange={(userId) => {
            const assignee = members.find((member) => member.id === userId)
            void epicEditor.saveField(
              'assignee',
              { assignee_id: userId },
              {
                assigneeId: userId,
                assigneeName: assignee?.name ?? 'Unassigned',
                assigneeAvatar: assignee?.avatarUrl,
              },
              {
                assigneeId: epicDetails.epic?.assigneeId ?? null,
                assigneeName: epicDetails.epic?.assigneeName ?? 'Unassigned',
                assigneeAvatar: epicDetails.epic?.assigneeAvatar,
              },
            )
          }}
          onDeadlineChange={(deadline) => {
            const normalizedDeadline = deadline
              ? deadline.match(/^\d{4}-\d{2}-\d{2}/)?.[0] ?? deadline
              : null
            const previousDeadline = epicDetails.epic?.date
              ? epicDetails.epic.date.match(/^\d{4}-\d{2}-\d{2}/)?.[0] ??
                epicDetails.epic.date
              : ''
            void epicEditor.saveField(
              'deadline',
              { deadline: normalizedDeadline },
              { date: normalizedDeadline ?? '' },
              { date: previousDeadline },
            )
          }}
        />
      )}
      {addTask.isOpen && <AddTaskModal {...addTask.modalProps} />}
    </AuthenticatedLayout>
  )
}
