import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProtectedRoute from '../components/ProtectedRoute'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import StudentDashboard from '../pages/student/Dashboard'
import StudentAssignments from '../pages/student/Assignments'
import SubmissionHistory from '../pages/student/SubmissionHistory'
import FacultyDashboard from '../pages/faculty/Dashboard'
import CreateAssignment from '../pages/faculty/CreateAssignment'
import ManageAssignments from '../pages/faculty/ManageAssignments'
import ViewSubmissions from '../pages/faculty/ViewSubmissions'
import Students from '../pages/faculty/Students'
import Profile from '../pages/Profile'

export default function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          {user?.role === 'FACULTY' ? <FacultyDashboard /> : <StudentDashboard />}
        </ProtectedRoute>
      } />

      {/* Student */}
      <Route path="/assignments" element={<ProtectedRoute role="STUDENT"><StudentAssignments /></ProtectedRoute>} />
      <Route path="/submissions" element={<ProtectedRoute role="STUDENT"><SubmissionHistory /></ProtectedRoute>} />

      {/* Faculty */}
      <Route path="/create-assignment" element={<ProtectedRoute role="FACULTY"><CreateAssignment /></ProtectedRoute>} />
      <Route path="/manage-assignments" element={<ProtectedRoute role="FACULTY"><ManageAssignments /></ProtectedRoute>} />
      <Route path="/view-submissions" element={<ProtectedRoute role="FACULTY"><ViewSubmissions /></ProtectedRoute>} />
      <Route path="/students" element={<ProtectedRoute role="FACULTY"><Students /></ProtectedRoute>} />

      {/* Shared */}
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
