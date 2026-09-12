import type React from 'react'
import { useAuth } from '../hooks/Useauth'
import { Navigate } from 'react-router-dom'
interface protectedrouteprops {
  children: React.ReactNode
}
export function Protectedroutes({ children }: protectedrouteprops) {
  const { isauth, isloading } = useAuth()
  if (isloading) {
    return null
  }
  if (!isauth) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}
