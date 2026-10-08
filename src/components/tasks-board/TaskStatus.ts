export interface TaskStatus {
  id: string
  label: string
  dotClass: string
  badgeClass: string
}
 const neutralBadge = 'bg-surface-highest text-slate-dark'
 
export const taskStatuses: TaskStatus[] = [
  { id: 'todo', label: 'To Do', dotClass: 'bg-babygray', badgeClass: neutralBadge },
  { id: 'in-progress', label: 'In Progress', dotClass: 'bg-navyblue', badgeClass: neutralBadge },
  { id: 'blocked', label: 'Blocked', dotClass: 'bg-darkred', badgeClass: 'bg-babyred text-error' },
  { id: 'in-review', label: 'In Review', dotClass: 'bg-slate-medium', badgeClass: neutralBadge },
  { id: 'ready-for-qa', label: 'Ready for QA', dotClass: 'bg-navyblue', badgeClass: neutralBadge },
  { id: 'reopened', label: 'Reopened', dotClass: 'bg-darkred', badgeClass: 'bg-babyred text-error' },
  { id: 'ready-for-prod', label: 'Ready for Prod', dotClass: 'bg-darkgreen', badgeClass: 'bg-success text-on-success' },
  { id: 'done', label: 'Done', dotClass: 'bg-emerald-400', badgeClass: 'bg-success text-on-success' },
]
