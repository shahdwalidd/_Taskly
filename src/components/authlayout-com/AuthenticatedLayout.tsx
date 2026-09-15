import { useState, type ReactNode } from 'react'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { MobileDrawer } from './MobileDrawer'
import { BottomNav } from './BottomNav'
import { useAuth } from '../../hooks/useAuth'

interface AuthenticatedLayoutProps {
  projectName?: string
  children: ReactNode
}

export function AuthenticatedLayout({
  projectName,
  children,
}: AuthenticatedLayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { logout, isLoggingOut, logoutError } = useAuth()

  return (
    <div className="bg-surface flex h-screen overflow-hidden">
      <Sidebar
        projectName={projectName}
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
        logout={logout}
        isLoggingOut={isLoggingOut}
        logoutError={logoutError}
      />

      <BottomNav hasActiveProject={Boolean(projectName)} />
    </div>
  )
}
