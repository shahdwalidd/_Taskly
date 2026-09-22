export interface AddProjectPayload {
  name: string
  description?: string
}

export interface AddProjectErrorResponse {
  code: number
  details: string
  hint: string
  message: string
}
export interface Project {
  id: string
  name: string
  description: string
  created_by: string
  created_at: string
}

export interface ProjectsErrorResponse {
  code: string
  details: string | null
  hint: string | null
  message: string
}
export interface UpdateProjectPayload {
  name: string
  description?: string
}
