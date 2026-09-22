import { useState, type ReactNode } from 'react'
import { Navbar } from '@/components/auth-layout/Navbar'
import { Sidebar } from '@/components/auth-layout/Sidebar'
import { MobileDrawer } from '@/components/auth-layout/MobileDrawer'
import { BottomNav } from '@/components/auth-layout/BottomNav'
import { useAuth } from '@/hooks/useAuth'

interface AuthenticatedLayoutProps {
  projectName?: string
  projectId?: string
  children: ReactNode
}

export function AuthenticatedLayout({
  projectName,
  projectId,
  children,
}: AuthenticatedLayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { logout, isLoggingOut, logoutError } = useAuth()

  return (
    <div className="bg-surface flex h-screen overflow-hidden">
      <Sidebar
        projectName={projectName}
        projectId={projectId}
        logout={logout}
        isLoggingOut={isLoggingOut}
        logoutError={logoutError}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar onMenuClick={() => setIsDrawerOpen(true)} />

        <main className="bg-background flex-1 overflow-y-auto pb-16 md:pb-0">
          {children}
        </main>
      </div>

      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        projectName={projectName}
        projectId={projectId}
        logout={logout}
        isLoggingOut={isLoggingOut}
        logoutError={logoutError}
      />

      <BottomNav projectId={projectId} />
    </div>
  )
}
