const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY
import type { UserResponse } from "../types/user.types"
export async function getUser(  accessToken: string,
): Promise< UserResponse>{
     const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    method: 'GET',
    headers: {
      apikey: SUPABASE_KEY,
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