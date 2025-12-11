import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import AnimalsPage from './pages/AnimalsPage'
import SpeciesPage from './pages/SpeciesPage'
import EnclosuresPage from './pages/EnclosuresPage'
import UsersPage from './pages/UsersPage'
import { UserRole } from './types'
import { Box, CircularProgress, Stack, Typography } from '@mui/material'

function RootRedirect() {
  const { user, isLoading } = useAuth()
  
  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <CircularProgress />
          <Typography variant="body1" color="text.secondary">Загрузка...</Typography>
        </Stack>
      </Box>
    )
  }
  
  return <Navigate to={user ? '/dashboard' : '/login'} replace />
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  return (
    <Box>
      {user && <Header />}
      <Box component="main" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 3 } }}>
        {children}
      </Box>
    </Box>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/animals"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AnimalsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/species"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <SpeciesPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/enclosures"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <EnclosuresPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
                <AppLayout>
                  <UsersPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
