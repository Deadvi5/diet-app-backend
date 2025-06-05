import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import Login from './pages/Login'
import Patients from './pages/Patients'
import PatientDiets from './pages/PatientDiets'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-base-200">
          <header className="p-4 bg-base-100 shadow mb-4">
            <h1 className="text-2xl font-bold">DietApp</h1>
          </header>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/patients/:id" element={<PatientDiets />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
