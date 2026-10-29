import { createPortal } from 'react-dom'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import CalendarIcon from '@/assets/CalendarIcon.svg?react'
import CloseIcon from '@/assets/CloseIcon (2).svg?react'
import { useProjectEpics } from '@/hooks/useProjectEpics'
import { useProjectMembers } from '@/hooks/useProjectMembers'
import { useTaskDetails } from '@/hooks/useTaskDetails'
import {
  TASK_STATUS_VALUES,
  type SelectOption,
  type TaskDetails,
  type TaskStatusValue,
} from '@/types/addTask.types'
import { formatTaskDetailsDate, getTodayISO } from '@/utils/formatDate'
import { getInitials } from '@/utils/getInitials'
import { TaskDateField } from '../task-form/TaskDateField'
import { TaskDescriptionField } from '../task-form/TaskDescriptionField'
import { TaskField } from '../task-form/TaskField'
import { TaskSelectField } from '../task-form/TaskSelectField'
import { TaskTitleField } from '../task-form/TaskTitleField'
import { getTaskStatusLabel, taskStatuses } from '../tasks-board/TaskStatus'
import { TaskDetailsFooter } from './TaskDetailsFooter'

interface TaskDetailsModalProps {
  projectId: string
  taskId: string
  onClose: () => void
  onCopyLink: () => void
  onTaskUpdated?: (taskId: string, updates: Partial<TaskDetails>) => void
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

function isTaskStatus(value: string): value is TaskStatusValue {
  return TASK_STATUS_VALUES.includes(value as TaskStatusValue)
}

interface TaskPropertiesProps {
  task: TaskDetails
  projectId: string
  savingFields: ReadonlySet<string>
  onSaveField: (
    field: 'status' | 'assignee_id' | 'epic_id' | 'due_date',
    updates: {
      status?: TaskStatusValue
      assignee_id?: string | null
      epic_id?: string | null
      due_date?: string | null
    },
    optimisticTask: Partial<TaskDetails>,
  ) => Promise<void>
}

type SaveTaskField = ReturnType<typeof useTaskDetails>['saveField']

function EditableTaskTitle({
  task,
  disabled,
  saveField,
}: {
  task: TaskDetails
  disabled: boolean
  saveField: SaveTaskField
}) {
  const [draft, setDraft] = useState(task.title ?? '')

  return (
    <TaskTitleField
      value={draft}
      disabled={disabled}
      onChange={setDraft}
      onBlur={() => {
        const nextTitle = draft.trim()
        const currentTitle = task.title?.trim() ?? ''
        if (!nextTitle) {
          setDraft(task.title ?? '')
          toast.error('Task title cannot be empty.')
          return
        }
        if (nextTitle === currentTitle) {
          setDraft(task.title ?? '')
          return
        }
        void saveField('title', { title: nextTitle }, { title: nextTitle })
      }}
      placeholder="Untitled task"
    />
  )
}

function EditableTaskDescription({
  task,
  disabled,
  saveField,
}: {
  task: TaskDetails
  disabled: boolean
  saveField: SaveTaskField
}) {
  const [draft, setDraft] = useState(task.description ?? '')

  return (
    <TaskDescriptionField
      value={draft}
      disabled={disabled}
      onChange={setDraft}
      onBlur={() => {
        const nextDescription = draft.trim() ? draft : null
        const currentDescription = task.description?.trim()
          ? task.description
          : null
        if (nextDescription === currentDescription) {
          setDraft(task.description ?? '')
          return
        }
        void saveField(
          'description',
          { description: nextDescription },
          { description: nextDescription },
        )
      }}
      placeholder="No description provided"
    />
  )
}

function TaskProperties({ task, projectId, savingFields, onSaveField }: TaskPropertiesProps) {
  const status = task.status?.trim() ?? ''
  const membersQuery = useProjectMembers(projectId)
  const epicsQuery = useProjectEpics(projectId, false, true)
  const assigneeId = task.assignee_id ?? task.assignee?.id ?? ''
  const assigneeName = task.assignee?.name?.trim() || task.assignee?.user_metadata?.name?.trim() || 'Unassigned'
  const assigneeAvatar = getSafeAvatarUrl(task.assignee?.avatar_url ?? task.assignee?.user_metadata?.avatar_url ?? task.assignee?.picture ?? task.assignee?.user_metadata?.picture)
  const memberOptions: SelectOption[] = membersQuery.members.map((member) => ({
    value: member.id,
    label: member.name?.trim() || member.email,
  }))
  if (assigneeId && !memberOptions.some((option) => option.value === assigneeId)) {
    memberOptions.unshift({ value: assigneeId, label: assigneeName })
  }
  const epicId = task.epic_id ?? task.epic?.id ?? ''
  const epicTitle = task.epic?.title?.trim() ?? ''
  const epicCode = task.epic?.epic_id == null ? '' : String(task.epic.epic_id)
  const formattedEpicCode = epicCode && !epicCode.toUpperCase().startsWith('EPIC-')
    ? `EPIC-${epicCode}`
    : epicCode
  const epicName = epicTitle
    ? formattedEpicCode ? `(${formattedEpicCode}) ${epicTitle}` : epicTitle
    : ''
  const epicOptions: SelectOption[] = epicsQuery.epics.map((epic) => ({
    value: epic.id,
    label: `(${epic.code.toUpperCase().startsWith('EPIC-') ? epic.code : `EPIC-${epic.code}`}) ${epic.title}`,
  }))
  if (epicId && !epicOptions.some((option) => option.value === epicId)) {
    epicOptions.unshift({ value: epicId, label: epicName || 'Current epic' })
  }
  const dueDate = task.due_date?.slice(0, 10) ?? ''
  const createdByName = task.created_by?.name?.trim() || task.created_by?.user_metadata?.name?.trim() || '—'
  const createdByAvatar = getSafeAvatarUrl(task.created_by?.avatar_url ?? task.created_by?.user_metadata?.avatar_url ?? task.created_by?.picture ?? task.created_by?.user_metadata?.picture)

  useEffect(() => {
    if (
      epicsQuery.status === 'success' &&
      epicId &&
      !epicsQuery.epics.some((epic) => epic.id === epicId)
    ) {
      void onSaveField('epic_id', { epic_id: null }, { epic_id: null, epic: null })
    }
  }, [epicId, epicsQuery.epics, epicsQuery.status, onSaveField])

  return (
    <>
      <TaskSelectField
        id="task-details-status"
        label="Status"
        options={[
          ...(!isTaskStatus(status) && status ? [{ value: status, label: getTaskStatusLabel(status) }] : []),
          ...taskStatuses.map(({ id, label }) => ({ value: id, label })),
        ]}
        value={status}
        disabled={savingFields.has('status')}
        onChange={(value) => {
          if (!isTaskStatus(value) || value === status) return
          void onSaveField('status', { status: value }, { status: value })
        }}
      />
      <TaskSelectField
        id="task-details-assignee"
        label="Assignee"
        options={memberOptions}
        value={assigneeId}
        disabled={savingFields.has('assignee_id') || membersQuery.status !== 'success'}
        onChange={(value) => {
          const nextAssigneeId = value || null
          if (nextAssigneeId === (assigneeId || null)) return
          const member = membersQuery.members.find((item) => item.id === value)
          const nextName = member?.name?.trim() || member?.email || 'Unassigned'
          const nextAvatar = member?.avatarUrl ?? null
          void onSaveField(
            'assignee_id',
            { assignee_id: nextAssigneeId },
            {
              assignee_id: nextAssigneeId,
              assignee: member
                ? { id: member.id, name: nextName, avatar_url: nextAvatar }
                : null,
            },
          )
        }}
        placeholder="Unassigned"
        withAvatar
        avatarUrl={assigneeId ? assigneeAvatar : null}
      />
      {membersQuery.status === 'error' && (
        <button
          type="button"
          onClick={() => void membersQuery.refetch()}
          className="text-primary -mt-3 self-start text-xs font-semibold underline"
        >
          Retry loading project members
        </button>
      )}
      <TaskSelectField
        id="task-details-epic"
        label="Epic"
        options={epicOptions}
        value={epicId}
        disabled={savingFields.has('epic_id')}
        onFocus={epicsQuery.refetch}
        onChange={(value) => {
          const nextEpicId = value || null
          if (nextEpicId === (epicId || null)) return
          const epic = epicsQuery.epics.find((item) => item.id === value)
          void onSaveField(
            'epic_id',
            { epic_id: nextEpicId },
            {
              epic_id: nextEpicId,
              epic: epic
                ? { id: epic.id, epic_id: epic.code, title: epic.title }
                : null,
            },
          )
        }}
        placeholder="No epic"
      />
      {epicsQuery.status === 'error' && (
        <button
          type="button"
          onClick={epicsQuery.refetch}
          className="text-primary -mt-3 self-start text-xs font-semibold underline"
        >
          Retry loading epics
        </button>
      )}
      <TaskDateField
        id="task-details-due-date"
        label="Due date"
        value={dueDate}
        disabled={savingFields.has('due_date')}
        min={getTodayISO()}
        clearable
        onChange={(value) => {
          if (value && value < getTodayISO()) {
            toast.error('Due date cannot be earlier than today.')
            return
          }
          if (value === dueDate) return
          const nextDueDate = value ? `${value}T12:00:00Z` : null
          void onSaveField(
            'due_date',
            { due_date: nextDueDate },
            { due_date: nextDueDate },
          )
        }}
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

export function TaskDetailsModal({ projectId, taskId, onClose, onCopyLink, onTaskUpdated }: TaskDetailsModalProps) {
  const { status, task, retry, savingFields, saveField } = useTaskDetails(
    projectId,
    taskId,
    onTaskUpdated,
  )
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
                <EditableTaskTitle
                  key={`${task.id}:${task.title}`}
                  task={task}
                  disabled={savingFields.has('title')}
                  saveField={saveField}
                />
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
              <EditableTaskDescription
                key={`${task.id}:${task.description}`}
                task={task}
                disabled={savingFields.has('description')}
                saveField={saveField}
              />
            )}
          </div>

          <div className="hidden md:block">
            <TaskDetailsFooter onClose={onClose} onCopyLink={onCopyLink} />
          </div>
        </div>

        <aside className="mt-4 flex flex-col gap-4 md:mt-0 md:w-80 md:shrink-0 md:gap-6 md:border-l md:border-surface-highest/60 md:px-8 md:pt-9">
          {status === 'success' && task && (
            <TaskProperties
              task={task}
              projectId={projectId}
              savingFields={savingFields}
              onSaveField={saveField}
            />
          )}
          {status === 'loading' && Array.from({ length: 6 }, (_, index) => <div key={index} className="bg-authcard h-16 animate-pulse rounded-md" />)}
        </aside>
      </section>
    </div>,
    document.body,
  )
}
