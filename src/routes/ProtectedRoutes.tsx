import type React from 'react'
import { useAuth } from '../hooks/Useauth'
import { Navigate } from 'react-router-dom'
interface protectedRouteprops {
  children: React.ReactNode
}
export function ProtectedRoutes({ children }: protectedRouteprops) {
  const { isauth, isloading } = useAuth()
  if (isloading) {
    return null
  }
  if (!isauth) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}
