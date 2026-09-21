import type {
  AddProjectPayload,
  AddProjectErrorResponse,
} from '@/types/project.types'
import type { Project, ProjectsErrorResponse } from '@/types/project.types'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
export async function createProject(
  payload: AddProjectPayload,
  accessToken: string,
) {
  const response = await fetch(`${supabaseUrl}/rest/v1/projects`, {
    method: 'POST',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const responseText = await response.text()
  let result: unknown = null

  if (responseText) {
    try {
      result = JSON.parse(responseText)
    } catch {
      result = responseText
    }
  }

  if (!response.ok) {
    const errorData = result as AddProjectErrorResponse
    throw new Error(
      errorData?.message || 'Failed To Add New Project, Try Again Later',
    )
  }

  return result
}
export async function getProjects(accessToken: string): Promise<Project[]> {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/get_projects`, {
    method: 'GET',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })
  const responseText = await response.text()
  let result: unknown = null
  if (responseText) {
    try {
      result = JSON.parse(responseText)
    } catch {
      result = responseText
    }
  }
  if (!response.ok) {
    const errorData = result as ProjectsErrorResponse
    throw new Error(errorData?.message || 'Failed to load projects')
  }

  return result as Project[]
}
