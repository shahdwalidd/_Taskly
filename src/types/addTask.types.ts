
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

export interface TaskUser {
  id?: string
  name?: string | null
  avatar_url?: string | null
  picture?: string | null
  user_metadata?: {
    name?: string
    avatar_url?: string
    picture?: string
  }
}

export interface TaskEpic {
  id?: string
  epic_id?: string | number
  title?: string | null
}

export interface Task {
  id: string
  project_id: string
  epic_id: string | null
  title: string | null
  description: string | null
  status: TaskStatusValue
  created_at: string | null
  due_date: string | null
  task_id: string | number | null
  epic: TaskEpic | null
  created_by: TaskUser | null
  assignee: TaskUser | null
}

export type TaskCardState = 'default' | 'today' | 'delayed' | 'completed'
 

export interface CreateTaskPayload {
  project_id: string
  title: string
  status?: TaskStatusValue
  epic_id?: string
  description?: string
  assignee_id?: string
  due_date?: string 
}