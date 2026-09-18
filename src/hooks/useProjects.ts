import { useCallback, useEffect, useState } from 'react'
import { getSession } from '../store/Authstore'
import type { Project } from '../types/project.types'
import { getProjects } from '../services/ProjectService'
type Projectstatus = 'loading' | 'error' | 'success'
interface UseprojectReturn {
  status: Projectstatus
  projects: Project[]
  refetch: () => void
}
export function useProjects(): UseprojectReturn {
  const [status, setstatus] = useState<Projectstatus>('loading')
  const [projects, setprojects] = useState<Project[]>([])
  const fetchProjects = useCallback(async () => {
    setstatus('loading')
    const session = getSession()
    if (!session) {
      setstatus('error')
      return
    }
    try {
      const data = await getProjects(session.access_token)
      setprojects(data)
      setstatus('success')
    } catch {
      setstatus('error')
    }
  }, [])
  useEffect(() => {
    void Promise.resolve().then(fetchProjects)
  }, [fetchProjects])

  return { status, projects, refetch: fetchProjects }
}
