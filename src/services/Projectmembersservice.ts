import { apiRequest } from '@/services/apiClient'
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
