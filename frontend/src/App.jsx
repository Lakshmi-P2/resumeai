import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import Results from './pages/Results'
import JobBoard from './pages/JobBoard'
import MyApplications from './pages/MyApplications'
import AITools from './pages/AITools'
import Pricing from './pages/Pricing'
import About from './pages/About'
import AdminDashboard from './pages/admin/AdminDashboard'
import SuperAdmin from './pages/superadmin/SuperAdmin'
import Notifications from './pages/Notifications'
import ForgotPassword from './pages/ForgotPassword'

function PrivateRoute({ children, role }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  if (role && user.role !== role) return <Navigate to="/dashboard" />
  return children
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/about" element={<About />} />
      <Route path="/jobs" element={<JobBoard />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      <Route path="/upload" element={
        <PrivateRoute>
          <Upload />
        </PrivateRoute>
      } />
      <Route path="/results/:id" element={
        <PrivateRoute>
          <Results />
        </PrivateRoute>
      } />
      <Route path="/applications" element={
        <PrivateRoute>
          <MyApplications />
        </PrivateRoute>
      } />
      <Route path="/ai-tools" element={
        <PrivateRoute>
          <AITools />
        </PrivateRoute>
      } />
      <Route path="/admin" element={
        <PrivateRoute role="company">
          <AdminDashboard />
        </PrivateRoute>
      } />
      <Route path="/superadmin" element={
        <PrivateRoute role="superadmin">
          <SuperAdmin />
        </PrivateRoute>
      } />
    </Routes>
  )
}

export default App