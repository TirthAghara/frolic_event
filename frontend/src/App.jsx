import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import LoginPage from './Pages/LoginPage'
import RegistrationPage from './Pages/RegistrationPage'
import Dashboard from './Pages/Dashboard'
import AddEvent from './Pages/AddEvent'
import InstituteForm from './Pages/InstituteForm'
import GroupManagement from './Pages/GroupManagement'
import './App.css'

// Protected Layout Wrapper with Sidebar
function ProtectedLayout({ children }) {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, height: '100vh', overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  )
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'))
  const location = useLocation()

  // Check authentication status on mount and when location changes
  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [location])

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />

      {/* Protected Routes with Sidebar Layout */}
      <Route path="/" element={isAuthenticated ? <ProtectedLayout><Dashboard /></ProtectedLayout> : <Navigate to="/login" replace />} />
      <Route path="/dashboard" element={isAuthenticated ? <ProtectedLayout><Dashboard /></ProtectedLayout> : <Navigate to="/login" replace />} />
      <Route path="/add-event" element={isAuthenticated ? <ProtectedLayout><AddEvent /></ProtectedLayout> : <Navigate to="/login" replace />} />
      <Route path="/institute-form" element={isAuthenticated ? <ProtectedLayout><InstituteForm /></ProtectedLayout> : <Navigate to="/login" replace />} />
      <Route path="/groups" element={isAuthenticated ? <ProtectedLayout><GroupManagement /></ProtectedLayout> : <Navigate to="/login" replace />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
    </Routes>
  )
}

export default App
