import { useCallback, useEffect, useState } from 'react'
import { getProjectMembers } from '@/services/Projectmembersservice'
import { getSession } from '@/store/Authstore'
import type { Member } from '@/types/projectmembers.types'

type MembersStatus = 'loading' | 'error' | 'success'

export function useProjectMembers(projectId?: string) {
  const [status, setStatus] = useState<MembersStatus>('loading')
  const [members, setMembers] = useState<Member[]>([])

  const fetchMembers = useCallback(async () => {
    setStatus('loading')

    const session = getSession()
    if (!session?.access_token || !projectId) {
      setStatus('error')
      return
    }

    try {
      const data = await getProjectMembers(projectId, session.access_token)
      setMembers(data)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }, [projectId])

  useEffect(() => {
    void Promise.resolve().then(fetchMembers)
  }, [fetchMembers])

  return { status, members, refetch: fetchMembers }
}
