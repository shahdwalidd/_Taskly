
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useProject } from '@/hooks/useProject'
import { useDebounce } from '@/hooks/useDebounce'

export function useTasksPage() {
  const { projectId = '' } = useParams<{ projectId: string }>()
  const { project } = useProject(projectId)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)

  return {
    projectId,
    projectName: project?.name ?? 'Project',
    search,
    setSearch,
    debouncedSearch,
  }
}
