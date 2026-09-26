import type { UserResponse } from '@/types/user.types'
import { apiRequest } from './apiClient'

export async function getUser(accessToken: string): Promise<UserResponse> {
  return apiRequest<UserResponse>('/auth/v1/user', {
    method: 'GET',
    accessToken,
  })
}
