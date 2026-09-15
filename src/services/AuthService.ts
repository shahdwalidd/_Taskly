const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY
import type {
  SignupPayload,
  SignupSuccessResponse,
  SignupErrorResponse,
  LoginPayload,
  LoginSuccessResponse,
  LoginErrorResponse,
  RefreshResponse,
} from '../types/auth.types'
export async function signUp(
  payload: SignupPayload,
): Promise<SignupSuccessResponse> {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  const result = await response.json()
  if (!response.ok) {
    const errordata = result as SignupErrorResponse
    throw new Error(errordata.msg || 'something went wrong please try again')
  }
  return result as SignupSuccessResponse
}
export async function Login(
  payload: LoginPayload,
): Promise<LoginSuccessResponse> {
  const response = await fetch(
    `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
    {
      method: 'POST',
      headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
  )
  const result = await response.json()
  if (!response.ok) {
    const errordata = result as LoginErrorResponse
    throw new Error(errordata.msg || 'something went wrong please try again')
  }
  return result as LoginSuccessResponse
}
export async function refreshAccessToken(
  refreshToken: string,
): Promise<RefreshResponse> {
  const response = await fetch(
    `${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,
    {
      method: 'POST',
      headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    },
  )
  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.msg || 'something went wrong please try again')
  }
  return result
}
export  async function logout(accessToken: string):Promise<void>{
const response=await fetch(`${SUPABASE_URL}/auth/v1/logout`,{method:"POST",headers:{apikey:SUPABASE_KEY,   Authorization: `Bearer ${accessToken}`
,      'Content-Type': 'application/json',
}})
if(!response.ok){
  const result= await response.json();
  throw new Error(result.msg||'failed to logout')
}
}