import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import Login from './pages/Login'
import Patients from './pages/Patients'
import PatientDiets from './pages/PatientDiets'
import Admin from './pages/Admin'
import Layout from './Layout'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/patients/:id" element={<PatientDiets />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
