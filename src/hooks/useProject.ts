import { useEffect, useState } from 'react'
import { getProjectById } from '@/services/ProjectService'
import { getSession } from '@/store/Authstore'
import type { Project } from '@/types/project.types'

export function useProject(projectId?: string) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProject() {
      if (!projectId) {
        setError('Project ID is missing')
        setLoading(false)
        return
      }

      const session = getSession()

      if (!session?.access_token) {
        setError('Authentication required')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const data = await getProjectById(projectId, session.access_token)

        setProject(data)
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Failed to load project',
        )
        setProject(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [projectId])

  return {
    project,
    loading,
    error,
  }
}
