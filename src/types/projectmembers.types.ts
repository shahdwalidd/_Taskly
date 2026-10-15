export type MemberRole = 'owner' | 'admin' | 'member' | 'viewer'
export interface ProjectMemberDto {
  member_id: string
  project_id: string
  user_id: string
  role: MemberRole
  email: string
  metadata: {
    sub: string
    name: string
    email: string
    avatar_url?: string
    picture?: string
    department?: string
    email_verified?: boolean
    phone_verified?: boolean
  }
}
export interface Member {
  id: string
  name: string
  avatarUrl?: string
  email: string
  role: MemberRole
}
