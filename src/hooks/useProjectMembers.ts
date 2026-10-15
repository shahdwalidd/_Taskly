import { useCallback, useEffect, useRef, useState } from 'react'
import { getProjectMembers } from '@/services/Projectmembersservice'
import { getSession } from '@/store/Authstore'
import type { Member } from '@/types/projectmembers.types'

type MembersStatus = 'loading' | 'error' | 'success'

export function useProjectMembers(projectId?: string) {
  const [status, setStatus] = useState<MembersStatus>('loading')
  const [members, setMembers] = useState<Member[]>([])
  const requestVersion = useRef(0)

  const fetchMembers = useCallback(async () => {
    const request = ++requestVersion.current
    setStatus('loading')

    const session = getSession()
    if (!session?.access_token || !projectId) {
      setStatus('error')
      return
    }

    try {
      const data = await getProjectMembers(projectId, session.access_token)
      if (request === requestVersion.current) {
        setMembers(data)
        setStatus('success')
      }
    } catch {
      if (request === requestVersion.current) setStatus('error')
    }
  }, [projectId])

  useEffect(() => {
    void Promise.resolve().then(fetchMembers)
    return () => {
      requestVersion.current += 1
    }
  }, [fetchMembers])

  return { status, members, refetch: fetchMembers }
}
