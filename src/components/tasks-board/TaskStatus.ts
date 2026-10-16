import type { TaskStatusValue } from '@/types/addTask.types'

export interface TaskStatus {
  id: TaskStatusValue
  label: string
  dotClass: string
  badgeClass: string
  pillClass: string
}
 const neutralBadge = 'bg-surface-highest text-slate-dark'
 
export const taskStatuses: TaskStatus[] = [
  { id: 'TO_DO', label: 'To Do', dotClass: 'bg-babygray', badgeClass: neutralBadge, pillClass: neutralBadge },
  { id: 'IN_PROGRESS', label: 'In Progress', dotClass: 'bg-navyblue', badgeClass: neutralBadge, pillClass: 'bg-surface-highest text-primary' },
  { id: 'BLOCKED', label: 'Blocked', dotClass: 'bg-darkred', badgeClass: 'bg-babyred text-error', pillClass: 'bg-babyred text-error' },
  { id: 'IN_REVIEW', label: 'In Review', dotClass: 'bg-slate-medium', badgeClass: neutralBadge, pillClass: neutralBadge },
  { id: 'READY_FOR_QA', label: 'Ready for QA', dotClass: 'bg-navyblue', badgeClass: neutralBadge, pillClass: 'bg-primary-container text-white' },
  { id: 'REOPENED', label: 'Reopened', dotClass: 'bg-darkred', badgeClass: 'bg-babyred text-error', pillClass: 'bg-error text-white' },
  { id: 'READY_FOR_PRODUCTION', label: 'Ready for Prod', dotClass: 'bg-darkgreen', badgeClass: 'bg-success text-on-success', pillClass: 'bg-darkgreen text-white' },
  { id: 'DONE', label: 'Done', dotClass: 'bg-emerald-400', badgeClass: 'bg-success text-on-success', pillClass: 'bg-success text-on-success' },
]
