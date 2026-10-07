import { useCallback } from 'react'
import { useParams } from 'react-router-dom'

import { useProject } from '@/hooks/useProject'
import { useProjectMembers } from '@/hooks/useProjectMembers'

export function useProjectMembersPage() {
  const { projectId } = useParams<{ projectId: string }>()

  const {
    project,
    loading: projectLoading,
    error: projectError,
    refetch: refetchProject,
  } = useProject(projectId)

  const {
    members,
    status: membersStatus,
    refetch: refetchMembers,
  } = useProjectMembers(projectId)

  const isLoading = projectLoading || membersStatus === 'loading'
  const isError = Boolean(projectError) || membersStatus === 'error'

  const handleRetry = useCallback(() => {
    if (projectError) refetchProject()
    if (membersStatus === 'error') refetchMembers()
  }, [projectError, membersStatus, refetchProject, refetchMembers])

  const handleInvite = useCallback(() => {
    console.log()
  }, [])

  return {
    projectId: projectId ?? '',
    projectName: project?.name ?? 'Project',
    members,
    isLoading,
    isError,
    handleRetry,
    handleInvite,
  }
}
