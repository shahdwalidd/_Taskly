export interface SignupPayload {
  email: string
  password: string
  data: {
    name: string
    job_title?: string
  }
}
export interface SignupSuccessResponse {
  access_token: string
  user: {
    id: string
    email: string
  }
}
export interface SignupErrorResponse {
  code: number
  error_code: string
  msg: string
}
export interface LoginPayload {
  email: string
  password: string
}

export interface LoginSuccessResponse {
  access_token: string
  refresh_token: string
  expires_at: number
  user: {
    id: string
    email: string
  }
}
export interface LoginErrorResponse {
  code: number
  error_code: string
  msg: string
}
export interface RefreshResponse {
  access_token: string
  refresh_token: string
  expires_at: number
}
