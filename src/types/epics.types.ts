export interface CreateEpicPayload {
  title: string
  description: string
  assignee_id?: string
  project_id?: string
  deadline?: string
}

export interface EpicUser {
  id?: string
  name?: string
  avatar_url?: string
  picture?: string
  user_metadata?: {
    name?: string
    avatar_url?: string
    picture?: string
  }
}

export interface EpicResponse {
  id: string
  epic_id: string | number
  title: string
  description?: string | null
  assignee_id?: string | null
  assignee?: EpicUser | null
  created_by?: EpicUser | null
  deadline?: string | null
  created_at?: string | null
}

export interface EpicUpdatePayload {
  title?: string
  description?: string | null
  assignee_id?: string | null
  deadline?: string | null
}

export interface EpicListItem {
  id: string
  code: string
  title: string
  description?: string
  assigneeId?: string | null
  assigneeName: string
  assigneeAvatar?: string
  createdBy: string
  date: string
  createdAt?: string
  createdByAvatar?: string
}
