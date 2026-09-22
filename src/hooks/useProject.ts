import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { getProjectById } from '@/services/ProjectService'
import { getSession } from '@/store/Authstore'
import type { Project } from '@/types/project.types'

export function useProject() {
  const { projectId } = useParams<{ projectId: string }>()

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
        const data = await getProjectById(projectId, session.access_token)

        setProject(data)
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Failed to load project',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [projectId])

  return {
    projectId,
    project,
    loading,
    error,
  }
}
