import type { TaskStatusValue } from '@/types/addTask.types'

export interface TaskStatus {
  id: TaskStatusValue
  label: string
  dotClass: string
  badgeClass: string
}
 const neutralBadge = 'bg-surface-highest text-slate-dark'
 
export const taskStatuses: TaskStatus[] = [
  { id: 'TO_DO', label: 'To Do', dotClass: 'bg-babygray', badgeClass: neutralBadge },
  { id: 'IN_PROGRESS', label: 'In Progress', dotClass: 'bg-navyblue', badgeClass: neutralBadge },
  { id: 'BLOCKED', label: 'Blocked', dotClass: 'bg-darkred', badgeClass: 'bg-babyred text-error' },
  { id: 'IN_REVIEW', label: 'In Review', dotClass: 'bg-slate-medium', badgeClass: neutralBadge },
  { id: 'READY_FOR_QA', label: 'Ready for QA', dotClass: 'bg-navyblue', badgeClass: neutralBadge },
  { id: 'REOPENED', label: 'Reopened', dotClass: 'bg-darkred', badgeClass: 'bg-babyred text-error' },
  { id: 'READY_FOR_PRODUCTION', label: 'Ready for Prod', dotClass: 'bg-darkgreen', badgeClass: 'bg-success text-on-success' },
  { id: 'DONE', label: 'Done', dotClass: 'bg-emerald-400', badgeClass: 'bg-success text-on-success' },
]
