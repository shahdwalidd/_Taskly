import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { updateEpic as updateEpicRequest } from '@/services/EpicService'
import { getSession } from '@/store/Authstore'
import type { EpicListItem, EpicUpdatePayload } from '@/types/epics.types'

type EpicEditableField = 'title' | 'description' | 'assignee' | 'deadline'

export function useEditEpic(
  epicId: string | null,
  updateDetails: (epicId: string, updates: Partial<EpicListItem>) => void,
  updateList: (epicId: string, updates: Partial<EpicListItem>) => void,
) {
  const [savingFields, setSavingFields] = useState<Record<string, boolean>>({})
  const inFlightFields = useRef(new Set<string>())

  async function saveField(
    field: EpicEditableField,
    payload: EpicUpdatePayload,
    optimisticUpdate: Partial<EpicListItem>,
    rollbackUpdate: Partial<EpicListItem>,
  ) {
    if (!epicId) return

    const requestKey = `${epicId}:${field}`
    if (inFlightFields.current.has(requestKey)) return
    inFlightFields.current.add(requestKey)
    setSavingFields((current) => ({ ...current, [requestKey]: true }))

    const applyUpdate = (updates: Partial<EpicListItem>) => {
      updateDetails(epicId, updates)
      updateList(epicId, updates)
    }
    applyUpdate(optimisticUpdate)

    try {
      const accessToken = getSession()?.access_token
      if (!accessToken) throw new Error('Authentication is required')
      await updateEpicRequest(epicId, payload, accessToken)
    } catch {
      applyUpdate(rollbackUpdate)
      toast.error('Failed to update epic. Please try again.')
    } finally {
      inFlightFields.current.delete(requestKey)
      setSavingFields((current) => ({ ...current, [requestKey]: false }))
    }
  }

  return {
    saveField,
    savingFields: {
      title: Boolean(savingFields[`${epicId}:title`]),
      description: Boolean(savingFields[`${epicId}:description`]),
      assignee: Boolean(savingFields[`${epicId}:assignee`]),
      deadline: Boolean(savingFields[`${epicId}:deadline`]),
    },
  }
}