export interface UserMetadata {
  name: string
  department: string
}

export interface UserResponse {
  id: string
  email: string
  user_metadata: UserMetadata
}