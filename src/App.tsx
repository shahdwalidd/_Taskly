import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { SignUp } from '@/pages/SignUp'
import Login from '@/pages/LoginPage'
import { ProtectedRoutes } from '@/routes/ProtectedRoutes'
import { PublicRoutes } from '@/routes/PublicRoutes'
import { ProjectsPage } from '@/pages/ProjectsPage'
import { AddProjectPage } from '@/pages/AddProjectPage'
import { ProjectPage } from '@/pages/ProjectPage'
import { EditProjectPage } from './pages/EditProjectPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { RecoveryLinkHandler } from '@/components/auth-layout/RecoveryLinkHandler'
function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <BrowserRouter>
        <RecoveryLinkHandler />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />

          <Route
            path="/sign-up"
            element={
              <PublicRoutes>
                <SignUp />
              </PublicRoutes>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoutes>
                {' '}
                <Login />
              </PublicRoutes>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoutes>
                {' '}
                <ForgotPasswordPage />
              </PublicRoutes>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PublicRoutes>
                <ResetPasswordPage />
              </PublicRoutes>
            }
          />
          <Route
            path="/project"
            element={
              <ProtectedRoutes>
                <ProjectsPage />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/project/add"
            element={
              <ProtectedRoutes>
                <AddProjectPage />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/project/:projectId/epics"
            element={
              <ProtectedRoutes>
                <ProjectPage />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/project/:projectId/tasks"
            element={
              <ProtectedRoutes>
                <ProjectPage />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/project/:projectId/members"
            element={
              <ProtectedRoutes>
                <ProjectPage />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/project/:projectId/edit"
            element={
              <ProtectedRoutes>
                <EditProjectPage />
              </ProtectedRoutes>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
