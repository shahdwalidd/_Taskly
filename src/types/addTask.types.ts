
export interface TaskFormValues {
  title: string
  description: string
  status: string
  assigneeId: string
  epicId: string
  dueDate: string 
}

export interface SelectOption {
  label: string
  value: string
}
export const TASK_STATUS_VALUES = [
  'TO_DO',
  'IN_PROGRESS',
  'BLOCKED',
  'IN_REVIEW',
  'READY_FOR_QA',
  'REOPENED',
  'READY_FOR_PRODUCTION',
  'DONE',
] as const
 
export type TaskStatusValue = (typeof TASK_STATUS_VALUES)[number]
 

export interface CreateTaskPayload {
  project_id: string
  title: string
  status?: TaskStatusValue
  epic_id?: string
  description?: string
  assignee_id?: string
  due_date?: string 
}