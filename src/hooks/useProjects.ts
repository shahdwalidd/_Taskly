import { useCallback, useEffect, useState } from 'react'
import { getSession } from '@/store/Authstore'
import type { Project } from '@/types/project.types'
import { getProjects } from '@/services/ProjectService'
type Projectstatus = 'loading' | 'error' | 'success'
interface UseprojectReturn {
  status: Projectstatus
  projects: Project[]
  refetch: () => void
}
export function useProjects(): UseprojectReturn {
  const [status, setStatus] = useState<Projectstatus>('loading')
  const [projects, setProjects] = useState<Project[]>([])
  const fetchProjects = useCallback(async () => {
    setStatus('loading')
    const session = getSession()
    if (!session) {
      setStatus('error')
      return
    }
    try {
      const data = await getProjects(session.access_token)
      setProjects(data)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }, [])
  useEffect(() => {
    void Promise.resolve().then(fetchProjects)
  }, [fetchProjects])

  return { status, projects, refetch: fetchProjects }
}
