import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { EpicListItem } from '@/types/epics.types'
import { formDate } from '@/utils/formatDate'
import { EpicAssigneeField } from './EpicAssigneeField'
import type { EpicAssigneeOption } from './EpicAssigneeField'
import { EpicDateValue } from './EpicDateValue'
import { EpicDeadlineField } from './EpicDeadlineField'
import { EpicDetailField } from './EpicDetailField'
import { EpicDetailsHeader } from './EpicDetailsHeader'
import { EpicPersonValue } from './EpicPersonValue'
import { EpicTasksSection } from './EpicTasksSection'
import type { Task } from '@/types/addTask.types'

interface EpicDetailsModalProps {
  tasks: Task[]
  tasksStatus: 'idle' | 'loading' | 'success' | 'error'
  tasksError: string | null
  onRetryTasks: () => void
  code: string
  status: 'idle' | 'loading' | 'success' | 'error'
  epic: EpicListItem | null
  error: string | null
  onRetry: () => void
  onClose: () => void
  onCopyLink: () => void
  onAddTask: () => void
  onTaskClick: (taskId: string) => void
  onTitleChange: (title: string) => void
  onDescriptionChange: (description: string) => void
  assigneeOptions: EpicAssigneeOption[]
  membersStatus: 'loading' | 'error' | 'success'
  onRetryMembers: () => void
  savingFields: {
    title: boolean
    description: boolean
    assignee: boolean
    deadline: boolean
  }
  onAssigneeChange: (userId: string | null) => void
  onDeadlineChange: (deadline: string | null) => void
}

const boxClass =
  'border-surface-highest bg-authcard text-slate-dark focus:ring-primary-container w-full rounded-md border outline-none focus:ring-2'

export function EpicDetailsModal({
  tasks,
  tasksStatus,
  tasksError,
  onRetryTasks,
  code,
  status,
  epic,
  error,
  onRetry,
  onClose,
  onCopyLink,
  onAddTask,
  onTaskClick,
  onTitleChange,
  onDescriptionChange,
  assigneeOptions,
  membersStatus,
  onRetryMembers,
  savingFields,
  onAssigneeChange,
  onDeadlineChange,
}: EpicDetailsModalProps) {
  const [titleDraft, setTitleDraft] = useState(epic?.title ?? '')
  const [descriptionDraft, setDescriptionDraft] = useState(
    epic?.description ?? '',
  )

  // Drafts must reset when a newly loaded or refreshed epic replaces the current values.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTitleDraft(epic?.title ?? '')
  }, [epic?.id, epic?.title])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDescriptionDraft(epic?.description ?? '')
  }, [epic?.id, epic?.description])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const createdAt = epic?.createdAt
    ? new Date(epic.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Unknown'
  const deadlineValue = epic?.date ? epic.date.slice(0, 10) : ''
  const deadline = deadlineValue ? formDate(deadlineValue) : undefined

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="bg-slate-dark/20 absolute inset-0 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Epic details"
        className="bg-authcard shadow-card relative max-h-[90dvh] w-full overflow-y-auto rounded-t-3xl px-6 pt-8 pb-11 md:max-h-[calc(100dvh-4rem)] md:max-w-2xl md:rounded-lg md:p-8"
      >
        {/* Mobile bottom-sheet handle */}
        <div
          aria-hidden="true"
          className="bg-surface-highest mx-auto mb-8 h-1.5 w-12 rounded-full md:hidden"
        />

        <EpicDetailsHeader
          code={code}
          onCopyLink={onCopyLink}
          onClose={onClose}
        />

        {status === 'loading' && (
          <div
            role="status"
            className="flex min-h-64 items-center justify-center gap-3"
          >
            <span className="border-t-primary size-5 animate-spin rounded-full border-2 border-gray-300" />
            <span className="text-slate-medium text-sm">
              Loading epic details...
            </span>
          </div>
        )}

        {status === 'error' && (
          <div
            role="alert"
            className="flex min-h-64 flex-col items-center justify-center gap-3 text-center"
          >
            <p className="text-slate-dark text-sm">
              {error ?? 'Unable to load epic details. Please try again.'}
            </p>
            <button
              type="button"
              onClick={onRetry}
              className="text-primary text-sm font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        {status === 'success' && epic && (
          <>
            <input
              type="text"
              aria-label="Epic title"
              required
              value={titleDraft}
              onChange={(event) => setTitleDraft(event.target.value)}
              onBlur={() => {
                const title = titleDraft.trim()
                if (!title) {
                  setTitleDraft(epic.title)
                  return
                }
                if (title !== epic.title) onTitleChange(title)
              }}
              disabled={savingFields.title}
              aria-busy={savingFields.title}
              className={`${boxClass} mt-3 min-h-10 px-2 py-2 text-base font-semibold md:mt-4 md:min-h-14 md:px-3 md:text-xl`}
            />

            <textarea
              aria-label="Epic description"
              placeholder="No description provided"
              value={descriptionDraft}
              onChange={(event) => setDescriptionDraft(event.target.value)}
              onBlur={() => {
                const description = descriptionDraft === '' ? null : descriptionDraft
                if (description !== (epic.description ?? null)) {
                  onDescriptionChange(description ?? '')
                }
              }}
              disabled={savingFields.description}
              aria-busy={savingFields.description}
              className={`${boxClass} placeholder:text-slate-medium mt-8.5 h-27.5 resize-none overflow-y-auto p-2 text-sm wrap-break-word md:mt-11 md:h-37.5 md:p-3 md:text-base`}
            />

            <div className="mt-5 grid grid-cols-1 gap-x-4 gap-y-2.5 md:mt-7.5 md:grid-cols-2 md:gap-y-3.5">
              <EpicDetailField label="Assignee">
                <EpicAssigneeField
                  name={epic.assigneeName}
                  avatarUrl={epic.assigneeAvatar}
                  selectedId={epic.assigneeId ?? null}
                  options={assigneeOptions}
                  membersStatus={membersStatus}
                  isSaving={savingFields.assignee}
                  onRetryMembers={onRetryMembers}
                  onChange={(userId) => {
                    const currentAssigneeId = epic.assigneeId ?? null
                    const isAlreadyUnassigned =
                      currentAssigneeId === null &&
                      epic.assigneeName === 'Unassigned'

                    if (
                      userId === null
                        ? !isAlreadyUnassigned
                        : userId !== currentAssigneeId
                    ) {
                      onAssigneeChange(userId)
                    }
                  }}
                />
              </EpicDetailField>

              <EpicDetailField label="Deadline">
                <EpicDeadlineField
                  value={deadlineValue}
                  displayDate={deadline}
                  isSaving={savingFields.deadline}
                  onChange={(value) => {
                    const normalizedValue = value || null
                    if (normalizedValue !== (deadlineValue || null)) {
                      onDeadlineChange(normalizedValue)
                    }
                  }}
                />
              </EpicDetailField>

              <EpicDetailField label="Created by">
                <EpicPersonValue
                  name={epic.createdBy}
                  avatarUrl={epic.createdByAvatar}
                />
              </EpicDetailField>

              <EpicDetailField label="Created at">
                <EpicDateValue date={createdAt} />
              </EpicDetailField>
            </div>
          </>
        )}

        <EpicTasksSection
          tasks={tasks}
          status={tasksStatus}
          error={tasksError}
          onRetry={onRetryTasks}
          onAddTask={onAddTask}
          onTaskClick={onTaskClick}
        />
      </div>
    </div>,
    document.body,
  )
}
