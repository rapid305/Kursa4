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
import HowToRegIcon from '@mui/icons-material/HowToReg'
import LoginIcon from '@mui/icons-material/Login'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const isValid =
    formData.first_name.trim() &&
    formData.last_name.trim() &&
    formData.email.trim() &&
    formData.password.length >= 6

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await register({
        email: formData.email.trim(),
        password: formData.password,
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
      })
      navigate('/animals')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка регистрации. Попробуйте снова.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 6, display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Stack spacing={3}>
            <Stack spacing={0.5}>
              <Typography variant="h4" fontWeight={800}>Регистрация</Typography>
              <Typography variant="body1" color="text.secondary">Создайте новый аккаунт</Typography>
            </Stack>

            {error && <Alert severity="error">{error}</Alert>}

            <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Имя"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  fullWidth
                />
                <TextField
                  label="Фамилия"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  fullWidth
                />
              </Stack>

              <TextField
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                fullWidth
              />

              <TextField
                label="Пароль"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
                fullWidth
                helperText="Минимум 6 символов"
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<HowToRegIcon />}
                disabled={isLoading || !isValid}
                sx={{ borderRadius: 2, py: 1.5 }}
              >
                {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
              </Button>
            </Stack>

            <Typography variant="body2" color="text.secondary">
              Уже есть аккаунт?{' '}
              <Button component={Link} to="/login" variant="text" startIcon={<LoginIcon />} sx={{ textTransform: 'none' }}>
                Войти
              </Button>
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}

export default RegisterPage
