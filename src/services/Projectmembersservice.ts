import { apiRequest } from '@/services/apiClient'
import type { Member, ProjectMemberDto } from '@/types/projectmembers.types'

function toMember(dto: ProjectMemberDto): Member {
  return {
    id: dto.user_id,
    name: dto.metadata.name,
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

  const data = await apiRequest<ProjectMemberDto[]>(
    `/rest/v1/get_project_members?${params.toString()}`,
    { method: 'GET', accessToken },
  )

  return data.map(toMember)
}
