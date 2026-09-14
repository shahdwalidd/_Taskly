import type React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

interface PublicRoutesProps {
  children: React.ReactNode
}

export function PublicRoutes({ children }: PublicRoutesProps) {
  const { isauth, isloading } = useAuth()

  if (isloading) {
    return null
  }

  if (isauth) {
    return <Navigate to="/project" replace />
  }

  return <>{children}</>
}
