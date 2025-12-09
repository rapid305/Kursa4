import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { UserRole } from '../types'
import { Box, Stack, Typography, CircularProgress } from '@mui/material'

interface ProtectedRouteProps {
  children: React.ReactElement
  allowedRoles?: UserRole[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <CircularProgress />
          <Typography variant="body1" color="text.secondary">Загрузка...</Typography>
        </Stack>
      </Box>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Stack spacing={1} alignItems="center">
          <Typography variant="h3" fontWeight={800}>403</Typography>
          <Typography variant="body1" color="text.secondary">У вас нет доступа к этой странице</Typography>
        </Stack>
      </Box>
    )
  }

  return children
}

export default ProtectedRoute
