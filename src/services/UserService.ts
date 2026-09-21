const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
import type { UserResponse } from '@/types/user.types'
export async function getUser(accessToken: string): Promise<UserResponse> {
  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    method: 'GET',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.msg || 'Failed to fetch user data')
  }

  return result as UserResponse
}
