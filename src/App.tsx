import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SignUp } from './pages/SignUp'
import Login from './pages/LoginPage'
import { Protectedroutes } from './routes/Protectedroutes'
import { Navigate } from 'react-router-dom'
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/sign-up" replace />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/project"
            element={
              <Protectedroutes>
                <>Project page</>
              </Protectedroutes>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
