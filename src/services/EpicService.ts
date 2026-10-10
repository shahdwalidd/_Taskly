import type {
  CreateEpicPayload,
  EpicListItem,
  EpicResponse,
} from '@/types/epics.types'
import { apiRequest } from './apiClient'

function getUserName(
  user: EpicResponse['assignee'],
  fallback = 'Unassigned',
): string {
  return user?.user_metadata?.name ?? user?.name ?? fallback
}

function getUserAvatar(user: EpicResponse['assignee']): string | undefined {
  return (
    user?.user_metadata?.avatar_url ??
    user?.user_metadata?.picture ??
    user?.avatar_url ??
    user?.picture
  )
}

function toEpicListItem(epic: EpicResponse): EpicListItem {
  return {
    id: epic.id,
    code: String(epic.epic_id),
    title: epic.title,
    description: epic.description ?? undefined,
    assigneeName: getUserName(epic.assignee),
    assigneeAvatar: getUserAvatar(epic.assignee),
    createdBy: getUserName(epic.created_by, 'Unknown'),
    createdByAvatar: getUserAvatar(epic.created_by),
    date: epic.deadline ?? '',
    createdAt: epic.created_at ?? undefined,
  }
}

export async function getEpicDetails(
  projectId: string,
  epicId: string,
  accessToken: string,
): Promise<EpicListItem> {
  const params = new URLSearchParams({
    project_id: `eq.${projectId}`,
    id: `eq.${epicId}`,
  })
  const result = await apiRequest<EpicResponse[]>(
    `/rest/v1/project_epics?${params.toString()}`,
    {
      method: 'GET',
      accessToken,
      headers: { Prefer: 'count=exact' },
    },
  )

  if (!Array.isArray(result) || result.length === 0) {
    throw new Error('Epic details could not be found')
  }

  return toEpicListItem(result[0])
}

export async function createEpic(
  projectId: string,
  payload: Omit<CreateEpicPayload, 'project_id'>,
  accessToken: string,
): Promise<void> {
  await apiRequest('/rest/v1/epics', {
    method: 'POST',
    accessToken,
    body: JSON.stringify({
      project_id: projectId,
      ...payload,
    }),
  })
}

export async function getEpics(
  projectId: string,
  accessToken: string,
  limit?: number,
  offset?: number,
  searchTerm = '',
): Promise<{ epics: EpicListItem[]; totalCount: number }> {
  const paginationQuery =
    limit !== undefined && offset !== undefined
      ? `&limit=${limit}&offset=${offset}`
      : ''
  const params = new URLSearchParams({ project_id: `eq.${projectId}` })
  const normalizedSearchTerm = searchTerm.trim()
  if (normalizedSearchTerm) {
    params.set('title', `ilike.%${normalizedSearchTerm}%`)
  }
  const result = await apiRequest<EpicResponse[]>(
    `/rest/v1/project_epics?${params.toString()}${paginationQuery}`,
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
  if (!Array.isArray(result.data)) {
    throw new Error('The project epics response was invalid')
  }

  return {
    epics: result.data.map(toEpicListItem),
    totalCount,
  }
}
