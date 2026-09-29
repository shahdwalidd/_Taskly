export type MemberRole = 'owner' | 'admin' | 'member' | 'viewer'

export interface Member {
  id: string
  name: string
  email: string
  role: MemberRole
}
