
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useProject } from '@/hooks/useProject'

export function useTasksPage() {
  const { projectId = '' } = useParams<{ projectId: string }>()
  const { project } = useProject(projectId)
  const [search, setSearch] = useState('')

  return {
    projectId,
    projectName: project?.name ?? 'Project',
    search,
    setSearch,
  }
}