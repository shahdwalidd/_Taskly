import { createPortal } from 'react-dom'
import CloseIcon from '@/assets/CloseIcon (2).svg?react'
import { AddTaskModalFooter } from './AddTaskModalFooter'
import { TaskDateField } from '../task-form/TaskDateField'
import { TaskDescriptionField } from '../task-form/TaskDescriptionField'
import { TaskSelectField } from '../task-form/TaskSelectField'
import { TaskTitleField } from '../task-form/TaskTitleField'
import type { SelectOption, TaskFormValues } from '@/types/addTask.types'

interface AddTaskModalProps {
  values: TaskFormValues
  onChange: (field: keyof TaskFormValues, value: string) => void
  statusOptions: SelectOption[]
  assigneeOptions: SelectOption[]
  epicOptions: SelectOption[]
  assigneePlaceholder?: string
  assigneeDisabled?: boolean
  epicPlaceholder?: string
  epicDisabled?: boolean
  titleError?: string
  isSubmitting?: boolean
  onClose: () => void
  onSubmit: () => void
}

export function AddTaskModal({
  values,
  onChange,
  statusOptions,
  assigneeOptions,
  epicOptions,
  assigneePlaceholder = 'Select Team Member',
  assigneeDisabled = false,
  epicPlaceholder = 'Select Epic',
  epicDisabled = false,
  titleError,
  isSubmitting = false,
  onClose,
  onSubmit,
}: AddTaskModalProps) {
  return createPortal(
    <div className="fixed inset-0 z-60 flex items-end justify-center md:items-center">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="bg-slate-dark/40 absolute inset-0 backdrop-blur-sm"
      />

      <form
        role="dialog"
        aria-modal="true"
        aria-label="Add new task"
        aria-busy={isSubmitting}
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
        className="bg-surface-low shadow-card relative flex max-h-[90dvh] w-full flex-col overflow-y-auto rounded-t-3xl px-6 pt-8 pb-4 md:h-217.5 md:max-h-[calc(100dvh-4rem)] md:w-4xl md:flex-row md:overflow-hidden md:rounded-lg md:p-0"
      >
       
        <div
          aria-hidden="true"
          className="bg-surface-highest mx-auto mb-2.5 h-1.5 w-12 shrink-0 rounded-full md:hidden"
        />

        <div className="flex flex-col md:min-h-0 md:w-xl md:bg-authcard">
          <div className="md:border-surface-highest/60 md:border-b md:px-8 md:pt-6 md:pb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-slate-dark text-2xl font-bold md:text-xl md:font-semibold">
                Add New Task
              </h2>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                aria-label="Close"
                className="text-grey -mr-2 flex size-8 cursor-pointer items-center justify-center md:hidden"
              >
                <CloseIcon aria-hidden="true" className="size-3.5" />
              </button>
            </div>

            <div className="mt-icon-menu-width md:mt-6.5">
              <TaskTitleField
                value={values.title}
                onChange={(value) => onChange('title', value)}
                error={titleError}
              />
            </div>
          </div>

          <div className="mt-4 md:mt-0 md:min-h-0 md:flex-1 md:overflow-y-auto md:px-8 md:pt-8">
            <TaskDescriptionField
              value={values.description}
              onChange={(value) => onChange('description', value)}
            />
          </div>

          <AddTaskModalFooter onClose={onClose} isSubmitting={isSubmitting} />
        </div>

       
        <aside className="md:border-surface-highest/60 mt-4 flex flex-col gap-4 md:mt-0 md:w-80 md:shrink-0 md:gap-6 md:border-l md:px-8 md:pt-9">
          <TaskSelectField
            id="task-status"
            label="Status"
            options={statusOptions}
            value={values.status}
            onChange={(value) => onChange('status', value)}
          />

          <TaskSelectField
            id="task-assignee"
            label="Assignee"
            options={assigneeOptions}
            value={values.assigneeId}
            onChange={(value) => onChange('assigneeId', value)}
            placeholder={assigneePlaceholder}
            disabled={assigneeDisabled}
            withAvatar
          />

          <TaskSelectField
            id="task-epic"
            label="Epic"
            options={epicOptions}
            value={values.epicId}
            onChange={(value) => onChange('epicId', value)}
            placeholder={epicPlaceholder}
            disabled={epicDisabled}
          />

          <TaskDateField
            id="task-due-date"
            label="Due date"
            value={values.dueDate}
            onChange={(value) => onChange('dueDate', value)}
          />
        </aside>

    
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient mt-10 h-10 w-full cursor-pointer rounded-sm text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 md:hidden"
        >
          {isSubmitting ? 'Adding...' : 'Add Task'}
        </button>
      </form>
    </div>,
    document.body,
  )
}