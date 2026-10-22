import { createPortal } from 'react-dom'
import CloseIcon from '@/assets/CloseIcon (2).svg?react'
import { TaskDescriptionField } from '../task-form/TaskDescriptionField'
import { TaskTitleField } from '../task-form/TaskTitleField'
import { TaskDetailsFooter } from './TaskDetailsFooter'
import CalendarIcon from '@/assets/CalendarIcon.svg?react'
import { TaskDateField } from '../task-form/TaskDateField'
import { TaskSelectField } from '../task-form/TaskSelectField'
import { TaskField } from '../task-form/TaskField'

interface TaskDetailsModalProps {
  onClose: () => void
  onCopyLink: () => void
}

export function TaskDetailsModal({ onClose, onCopyLink }: TaskDetailsModalProps) {
  return createPortal(
    <div className="fixed inset-0 z-60 flex items-end justify-center md:items-center">
      <button type="button" aria-label="Close task details" onClick={onClose} className="bg-slate-dark/40 absolute inset-0 backdrop-blur-sm" />
      <section role="dialog" aria-modal="true" aria-label="Task details" className="bg-surface-low shadow-card relative flex max-h-[90dvh] w-full flex-col overflow-y-auto rounded-t-3xl px-6 pt-8 pb-4 md:h-217.5 md:max-h-[calc(100dvh-4rem)] md:w-4xl md:flex-row md:overflow-hidden md:rounded-lg md:p-0">
        <div aria-hidden="true" className="bg-surface-highest mx-auto mb-2.5 h-1.5 w-12 shrink-0 rounded-full md:hidden" />
        <div className="bg-authcard flex flex-col md:min-h-0 md:w-xl">
          <div className="md:border-surface-highest/60 md:border-b md:px-8 md:pt-6 md:pb-6">
            <div className="flex items-center justify-between">
              <span className="bg-surface-highest text-primary rounded-sm px-2 py-1 text-label-xs uppercase">TASK-ID</span>
              <button type="button" onClick={onClose} aria-label="Close" className="text-grey -mr-2 flex size-8 cursor-pointer items-center justify-center md:hidden"><CloseIcon aria-hidden="true" className="size-3.5" /></button>
            </div>
            <div className="mt-icon-menu-width md:mt-6.5"><TaskTitleField value="" onChange={() => undefined} readOnly /></div>
          </div>
          <div className="mt-4 md:mt-0 md:min-h-0 md:flex-1 md:overflow-y-auto md:px-8 md:pt-8">
            <TaskDescriptionField value="" onChange={() => undefined} readOnly />
            <div className="mt-4 flex flex-col gap-4 md:hidden">
              <TaskSelectField id="task-details-status-mobile" label="Status" options={[]} value="" onChange={() => undefined} readOnly />
              <TaskSelectField id="task-details-assignee-mobile" label="Assignee" options={[]} value="" onChange={() => undefined} withAvatar readOnly />
              <TaskSelectField id="task-details-epic-mobile" label="Epic" options={[]} value="" onChange={() => undefined} readOnly />
              <TaskDateField id="task-details-due-date-mobile" label="Due date" value="" onChange={() => undefined} readOnly />
              <TaskField id="task-details-created-by-mobile" label="Created by"><div className="border-surface-highest bg-authcard text-slate-dark flex h-10 items-center gap-2 rounded-md border px-2 text-xs"><span className="bg-surface-highest size-6 shrink-0 rounded-full" aria-hidden="true" /></div></TaskField>
              <TaskField id="task-details-created-at-mobile" label="Created at"><div className="border-surface-highest bg-authcard text-slate-dark flex h-10 items-center gap-2 rounded-md border px-2 text-xs"><CalendarIcon aria-hidden="true" /></div></TaskField>
            </div>
          </div>
          <TaskDetailsFooter onClose={onClose} onCopyLink={onCopyLink} />
        </div>
        <aside className="md:border-surface-highest/60 mt-4 flex flex-col gap-4 md:mt-0 md:w-80 md:shrink-0 md:gap-6 md:border-l md:px-8 md:pt-9">
          <TaskSelectField id="task-details-status" label="Status" options={[]} value="" onChange={() => undefined} readOnly />
          <TaskSelectField id="task-details-assignee" label="Assignee" options={[]} value="" onChange={() => undefined} withAvatar readOnly />
          <TaskSelectField id="task-details-epic" label="Epic" options={[]} value="" onChange={() => undefined} readOnly />
          <TaskDateField id="task-details-due-date" label="Due date" value="" onChange={() => undefined} readOnly />
          <TaskField id="task-details-created-by" label="Created by"><div className="border-surface-highest bg-authcard text-slate-dark flex h-10 items-center gap-2 rounded-md border px-2 text-xs"><span className="bg-surface-highest size-6 shrink-0 rounded-full" aria-hidden="true" /></div></TaskField>
          <TaskField id="task-details-created-at" label="Created at"><div className="border-surface-highest bg-authcard text-slate-dark flex h-10 items-center gap-2 rounded-md border px-2 text-xs"><CalendarIcon aria-hidden="true" /></div></TaskField>
        </aside>
      </section>
    </div>,
    document.body,
  )
}
