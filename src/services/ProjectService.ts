import { apiRequest } from './apiClient'
import type {
  AddProjectPayload,
  Project,
  UpdateProjectPayload,
} from '@/types/project.types'
export async function updateProject(
  projectId: string,
  payload: UpdateProjectPayload,
  accessToken: string,
): Promise<void> {
  await apiRequest(`/rest/v1/projects?id=eq.${projectId}`, {
    method: 'PATCH',
    accessToken,
    body: JSON.stringify(payload),
  })
}

export async function getProjectById(
  projectId: string,
  accessToken: string,
): Promise<Project> {
  const projects = await apiRequest<Project[]>(
    `/rest/v1/projects?id=eq.${projectId}`,
    {
      method: 'GET',
      accessToken,
    },
  )

  if (!projects.length) {
    throw new Error('Project not found')
  }

  return projects[0]
}

export async function createProject(
  payload: AddProjectPayload,
  accessToken: string,
): Promise<void> {
  await apiRequest<unknown>('/rest/v1/projects', {
    method: 'POST',
    accessToken,
    body: JSON.stringify(payload),
  })
}
export async function getProjects(
  accessToken: string,
  limit?: number,
  offset?: number,
): Promise<{ projects: Project[]; totalCount: number }> {
  const paginationQuery =
    limit !== undefined && offset !== undefined
      ? `?limit=${limit}&offset=${offset}`
      : ''
  const result = await apiRequest<Project[]>(
    `/rest/v1/rpc/get_projects${paginationQuery}`,
    {
      method: 'GET',
      includeHeaders: true,
      headers: {
        Prefer: 'count=exact',
      },
      accessToken,
    },
  )
  const contentRange = result.headers.get('Content-Range')
  const match = contentRange?.match(/\/(\d+)$/)
  const totalCount = match ? Number(match[1]) : 0

  return {
    projects: result.data,
    totalCount,
  }
}
