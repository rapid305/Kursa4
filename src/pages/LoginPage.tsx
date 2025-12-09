import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  Box,
  Container,
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  Alert,
} from '@mui/material'
import LoginIcon from '@mui/icons-material/Login'
import HowToRegIcon from '@mui/icons-material/HowToReg'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login({ email: email.trim(), password })
      navigate('/animals')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка входа. Проверьте данные.')
    } finally {
      setIsLoading(false)
    }
  }

  const isValid = email.trim() && password.length > 0

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 6, display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Stack spacing={3}>
            <Stack spacing={0.5}>
              <Typography variant="h4" fontWeight={800}>Вход</Typography>
              <Typography variant="body1" color="text.secondary">Войдите в свой аккаунт</Typography>
            </Stack>

            {error && <Alert severity="error">{error}</Alert>}

            <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                fullWidth
                autoFocus
              />

              <TextField
                label="Пароль"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                fullWidth
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<LoginIcon />}
                disabled={isLoading || !isValid}
                sx={{ borderRadius: 2, py: 1.5 }}
              >
                {isLoading ? 'Вход...' : 'Войти'}
              </Button>
            </Stack>

            <Typography variant="body2" color="text.secondary">
              Нет аккаунта?{' '}
              <Button component={Link} to="/register" variant="text" startIcon={<HowToRegIcon />} sx={{ textTransform: 'none' }}>
                Зарегистрироваться
              </Button>
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}

export default LoginPage
