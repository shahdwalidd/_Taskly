import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SignUp } from './pages/SignUp'
import Login from './pages/LoginPage'
import { ProtectedRoutes } from './routes/ProtectedRoutes'
import { PublicRoutes } from './routes/PublicRoutes'
import { ProjectsPage } from './pages/ProjectsPage'
function App() {
  return (
    <>
      <BrowserRouter>
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
            path="/project"
            element={
              <ProtectedRoutes>
               <ProjectsPage/>
              </ProtectedRoutes>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
