import type {
  CreateEpicPayload,
  EpicListItem,
  EpicResponse,
} from '@/types/epics.types'
import { apiRequest } from './apiClient'

function getUserName(user: EpicResponse['assignee']): string {
  return user?.user_metadata?.name ?? user?.name ?? 'Unassigned'
}

function toEpicListItem(epic: EpicResponse): EpicListItem {
  const assigneeAvatar =
    epic.assignee?.user_metadata?.avatar_url ??
    epic.assignee?.user_metadata?.picture ??
    epic.assignee?.avatar_url ??
    epic.assignee?.picture

  return {
    id: epic.id,
    code: String(epic.epic_id),
    title: epic.title,
    assigneeName: getUserName(epic.assignee),
    assigneeAvatar,
    createdBy: getUserName(epic.created_by),
    date: epic.deadline ?? '',
  }
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
): Promise<EpicListItem[]> {
  const params = new URLSearchParams({ project_id: `eq.${projectId}` })
  const result = await apiRequest<EpicResponse[]>(
    `/rest/v1/project_epics?${params.toString()}`,
    {
      method: 'GET',
      accessToken,
    },
  )

  if (!Array.isArray(result)) {
    throw new Error('The project epics response was invalid')
  }

  return result.map(toEpicListItem)
}
