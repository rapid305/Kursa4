import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { usersApi } from '../api/users'
import { User, UserRole } from '../types'
import {
  Box,
  Container,
  Paper,
  Typography,
  Stack,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'

const UsersPage = () => {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      const data = await usersApi.getAll()
      setUsers(data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка загрузки пользователей')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (userUuid: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      return
    }

    try {
      await usersApi.delete(userUuid)
      setUsers(users.filter(u => u.uuid !== userUuid))
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Ошибка удаления пользователя')
    }
  }

  const roleChipColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'primary'
      case UserRole.MODERATOR:
        return 'secondary'
      default:
        return 'default'
    }
  }

  const roleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'Администратор'
      case UserRole.MODERATOR:
        return 'Модератор'
      default:
        return 'Пользователь'
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 3 }}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 3, mb: 2, borderRadius: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
            <Typography variant="h4" fontWeight={800} sx={{ color: '#4f46e5' }}>
              Управление пользователями
            </Typography>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadUsers} sx={{ borderRadius: 2 }}>
              Обновить
            </Button>
          </Stack>
        </Paper>

        {error && (
          <Paper elevation={1} sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: '#ffebee', border: '1px solid #ffcdd2', color: '#c62828' }}>
            {error}
          </Paper>
        )}

        {isLoading ? (
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>Загрузка...</Paper>
        ) : users.length === 0 ? (
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>Пользователи не найдены</Paper>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Имя</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Роль</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell>Дата создания</TableCell>
                  {currentUser?.role === UserRole.ADMIN && <TableCell>Действия</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.uuid} hover>
                    <TableCell>{user.first_name} {user.last_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip label={roleLabel(user.role)} color={roleChipColor(user.role) as any} variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip label={user.is_active ? 'Активен' : 'Неактивен'} color={user.is_active ? 'success' : 'default'} variant="outlined" />
                    </TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString('ru-RU')}</TableCell>
                    {currentUser?.role === UserRole.ADMIN && (
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDelete(user.uuid)}
                          disabled={user.uuid === currentUser.uuid}
                        >
                          Удалить
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  )
}

export default UsersPage
