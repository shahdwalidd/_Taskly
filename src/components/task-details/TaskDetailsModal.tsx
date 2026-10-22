import { createPortal } from 'react-dom'
import { useEffect, useRef } from 'react'
import CalendarIcon from '@/assets/CalendarIcon.svg?react'
import CloseIcon from '@/assets/CloseIcon (2).svg?react'
import { useTaskDetails } from '@/hooks/useTaskDetails'
import type { TaskDetails } from '@/types/addTask.types'
import { formatTaskDetailsDate } from '@/utils/formatDate'
import { getInitials } from '@/utils/getInitials'
import { TaskDateField } from '../task-form/TaskDateField'
import { TaskDescriptionField } from '../task-form/TaskDescriptionField'
import { TaskField } from '../task-form/TaskField'
import { TaskSelectField } from '../task-form/TaskSelectField'
import { TaskTitleField } from '../task-form/TaskTitleField'
import { getTaskStatusLabel } from '../tasks-board/TaskStatus'
import { TaskDetailsFooter } from './TaskDetailsFooter'

interface TaskDetailsModalProps {
  projectId: string
  taskId: string
  onClose: () => void
  onCopyLink: () => void
}

function getSafeAvatarUrl(value?: string | null) {
  if (!value) return null
  try {
    const url = new URL(value, window.location.origin)
    return url.protocol === 'https:' || url.protocol === 'http:' ? value : null
  } catch {
    return null
  }
}

function TaskProperties({ task }: { task: TaskDetails }) {
  const status = task.status?.trim() ?? ''
  const assigneeName = task.assignee?.name?.trim() || task.assignee?.user_metadata?.name?.trim() || 'Unassigned'
  const assigneeAvatar = getSafeAvatarUrl(task.assignee?.avatar_url ?? task.assignee?.user_metadata?.avatar_url ?? task.assignee?.picture ?? task.assignee?.user_metadata?.picture)
  const epicTitle = task.epic?.title?.trim() ?? ''
  const epicId = task.epic?.epic_id == null ? '' : String(task.epic.epic_id)
  const epicCode = epicId && !epicId.toUpperCase().startsWith('EPIC-') ? `EPIC-${epicId}` : epicId
  const epicName = epicTitle
    ? epicCode ? `(${epicCode}) ${epicTitle}` : epicTitle
    : ''
  const createdByName = task.created_by?.name?.trim() || task.created_by?.user_metadata?.name?.trim() || '—'
  const createdByAvatar = getSafeAvatarUrl(task.created_by?.avatar_url ?? task.created_by?.user_metadata?.avatar_url ?? task.created_by?.picture ?? task.created_by?.user_metadata?.picture)

  return (
    <>
      <TaskSelectField
        id="task-details-status"
        label="Status"
        options={[{ value: status, label: getTaskStatusLabel(status) }]}
        value={status}
        onChange={() => undefined}
        readOnly
      />
      <TaskSelectField
        id="task-details-assignee"
        label="Assignee"
        options={assigneeName === 'Unassigned' ? [] : [{ value: assigneeName, label: assigneeName }]}
        value={assigneeName === 'Unassigned' ? '' : assigneeName}
        onChange={() => undefined}
        placeholder="Unassigned"
        withAvatar
        avatarUrl={assigneeAvatar}
        readOnly
      />
      <TaskSelectField
        id="task-details-epic"
        label="Epic"
        options={epicName ? [{ value: epicName, label: epicName }] : []}
        value={epicName}
        onChange={() => undefined}
        placeholder="No epic"
        readOnly
      />
      <TaskDateField
        id="task-details-due-date"
        label="Due date"
        value={task.due_date?.slice(0, 10) ?? ''}
        onChange={() => undefined}
        readOnly
        emptyLabel="No date"
      />
      <TaskField id="task-details-created-by" label="Created by">
        <div className="border-surface-highest bg-authcard text-slate-dark flex h-10 items-center gap-2 rounded-md border px-2 text-xs">
          {createdByName !== '—' && (
            <span className="bg-surface-highest text-primary flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full text-label-xs font-bold">
              {createdByAvatar ? <img src={createdByAvatar} alt="" className="size-full object-cover" /> : getInitials(createdByName)}
            </span>
          )}
          <span className="truncate">{createdByName}</span>
        </div>
      </TaskField>
      <TaskField id="task-details-created-at" label="Created at">
        <div className="border-surface-highest bg-authcard text-slate-dark flex h-10 items-center gap-2 rounded-md border px-2 text-xs">
          <CalendarIcon aria-hidden="true" className="size-4 shrink-0" />
          <span className="truncate">{formatTaskDetailsDate(task.created_at, 'No date')}</span>
        </div>
      </TaskField>
    </>
  )
}

function LoadingState() {
  return (
    <div role="status" aria-label="Loading task details" className="flex flex-col gap-4 py-2">
      <div className="bg-surface-highest h-4 w-1/4 animate-pulse rounded" />
      <div className="bg-surface-highest h-13.25 animate-pulse rounded-lg" />
      <div className="bg-surface-highest min-h-47 flex-1 animate-pulse rounded-lg md:min-h-117.5" />
    </div>
  )
}

export function TaskDetailsModal({ projectId, taskId, onClose, onCopyLink }: TaskDetailsModalProps) {
  const { status, task, retry } = useTaskDetails(projectId, taskId)
  const dialogRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopImmediatePropagation()
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown, true)
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true)
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [onClose])

  const rawTaskCode = task?.task_id == null ? '' : String(task.task_id).trim()
  const taskCode = !rawTaskCode
    ? '—'
    : rawTaskCode.toUpperCase().startsWith('TASK-')
      ? rawTaskCode
      : `TASK-${rawTaskCode}`

  return createPortal(
    <div className="fixed inset-0 z-60 flex items-end justify-center md:items-center">
      <button type="button" aria-label="Close task details" onClick={onClose} className="bg-slate-dark/40 absolute inset-0 backdrop-blur-sm" />

      <section
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Task details"
        className="bg-surface-low shadow-card relative flex max-h-[90dvh] w-full flex-col overflow-y-auto rounded-t-3xl px-6 pt-8 pb-4 outline-none md:h-217.5 md:max-h-[calc(100dvh-4rem)] md:w-4xl md:flex-row md:overflow-hidden md:rounded-lg md:p-0"
      >
        <div aria-hidden="true" className="bg-surface-highest mx-auto mb-2.5 h-1.5 w-12 shrink-0 rounded-full md:hidden" />

        <div className="bg-surface-low flex flex-col md:min-h-0 md:w-xl md:bg-authcard">
          <div className="md:border-surface-highest/60 md:border-b md:px-8 md:pt-6 md:pb-6">
            <div className="flex items-center justify-between">
              <span className="bg-surface-highest text-primary rounded-sm px-2 py-1 text-label-xs uppercase">{taskCode}</span>
              <button type="button" onClick={onClose} aria-label="Close" className="text-grey -mr-2 flex size-8 cursor-pointer items-center justify-center md:hidden">
                <CloseIcon aria-hidden="true" className="size-3.5" />
              </button>
            </div>
            <div className="mt-icon-menu-width md:mt-6.5">
              {status === 'success' && task ? (
                <TaskTitleField value={task.title?.trim() ?? ''} onChange={() => undefined} readOnly placeholder="Untitled task" />
              ) : (
                <div className="text-label-sm text-grey mt-4 uppercase">Title</div>
              )}
            </div>
          </div>

          <div className="mt-4 md:mt-0 md:min-h-0 md:flex-1 md:overflow-y-auto md:px-8 md:pt-8">
            {(status === 'loading' || status === 'idle') && <LoadingState />}
            {status === 'error' && (
              <div role="alert" className="flex min-h-64 flex-col items-center justify-center gap-4 text-center">
                <p className="text-error text-sm">Failed to load task details</p>
                <button type="button" onClick={retry} className="text-primary text-sm font-semibold underline">Retry</button>
              </div>
            )}
            {status === 'not-found' && <p role="status" className="text-slate-medium flex min-h-64 items-center justify-center text-sm">Task not found</p>}
            {status === 'success' && task && (
              <TaskDescriptionField value={task.description?.trim() ?? ''} onChange={() => undefined} readOnly placeholder="No description" />
            )}
          </div>

          <div className="hidden md:block">
            <TaskDetailsFooter onClose={onClose} onCopyLink={onCopyLink} />
          </div>
        </div>

        <aside className="mt-4 flex flex-col gap-4 md:mt-0 md:w-80 md:shrink-0 md:gap-6 md:border-l md:border-surface-highest/60 md:px-8 md:pt-9">
          {status === 'success' && task && <TaskProperties task={task} />}
          {status === 'loading' && Array.from({ length: 6 }, (_, index) => <div key={index} className="bg-authcard h-16 animate-pulse rounded-md" />)}
        </aside>
      </section>
    </div>,
    document.body,
  )
}
