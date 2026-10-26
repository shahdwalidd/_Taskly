import { apiRequest, getApiBaseUrl } from '@/services/apiClient'
import type { Member, ProjectMemberDto } from '@/types/projectmembers.types'

function toMember(dto: ProjectMemberDto): Member {
  return {
    id: dto.user_id,
    name: dto.metadata.name,
    avatarUrl: dto.metadata.avatar_url ?? dto.metadata.picture,
    email: dto.email,
    role: dto.role,
  }
}

export async function getProjectMembers(
  projectId: string,
  accessToken: string,
): Promise<Member[]> {
  if (!projectId) {
    throw new Error('Project id is required to load members')
  }

  const params = new URLSearchParams({ project_id: `eq.${projectId}` })
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), 15000)
  return apiRequest<ProjectMemberDto[]>(
    `/rest/v1/get_project_members?${params.toString()}`,
    { method: 'GET', accessToken, signal: controller.signal },
  )
    .then((data) => data.map(toMember))
    .finally(() => {
      window.clearTimeout(timeoutId)
    })
}

export async function inviteMember(
  projectId: string,
  email: string,
  accessToken: string,
): Promise<void> {
  const appUrl = import.meta.env.VITE_APP_URL?.trim() || window.location.origin
  const baseUrl = getApiBaseUrl()

  if (!projectId.trim()) {
    throw new Error('Project id is required to invite a member')
  }

  if (!baseUrl) {
    throw new Error('The backend URL is not configured')
  }

  await apiRequest<unknown>('/rest/v1/rpc/invite_member', {
    method: 'POST',
    accessToken,
    body: JSON.stringify({
      p_email: email,
      p_project_id: projectId,
      p_app_url: appUrl,
      p_base_url: baseUrl,
    }),
  })
}

function getAcceptedProjectId(result: unknown): string | null {
  if (
    typeof result === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(result)
  ) {
    return result
  }

  const candidate = Array.isArray(result) ? result[0] : result
  if (typeof candidate !== 'object' || candidate === null) return null

  const record = candidate as Record<string, unknown>
  const projectId = record.project_id ?? record.projectId
  if (typeof projectId === 'string' && projectId.trim()) return projectId.trim()

  const project = record.project
  if (typeof project === 'object' && project !== null && 'id' in project) {
    const id = project.id
    if (typeof id === 'string' && id.trim()) return id.trim()
  }

  return null
}

export async function acceptInvitation(
  token: string,
  accessToken: string,
): Promise<{ projectId: string | null }> {
  const result = await apiRequest<unknown>('/rest/v1/rpc/accept_invitation', {
    method: 'POST',
    accessToken,
    body: JSON.stringify({ p_token: token }),
  })

  if (result === false) {
    throw new Error('This invitation could not be accepted.')
  }

  if (typeof result === 'object' && result !== null && !Array.isArray(result)) {
    const response = result as Record<string, unknown>
    if (response.success === false || response.accepted === false) {
      const message = response.message ?? response.error
      throw new Error(
        typeof message === 'string' && message.trim()
          ? message.trim()
          : 'This invitation could not be accepted.',
      )
    }
  }

  return { projectId: getAcceptedProjectId(result) }
}
