import axios from 'axios'

const API_BASE_URL = '/api/v1'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests, except for auth endpoints
apiClient.interceptors.request.use(
  (config) => {
    const url = config.url || ''
    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register')
    if (!isAuthEndpoint) {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers = config.headers || {}
        ;(config.headers as any).Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Handle 401 errors: avoid redirect for login/register
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url || ''
    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register')
    if (status === 401 && !isAuthEndpoint) {
      const currentPath = window.location.pathname
      // Clear session
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Notify app to handle unauthorized state without hard reload
      window.dispatchEvent(new CustomEvent('auth-unauthorized'))
      // Avoid navigation if already on auth pages
      if (currentPath !== '/login' && currentPath !== '/register') {
        // Soft navigate without full reload; ProtectedRoute will handle redirect
        try {
          window.history.pushState(null, '', '/login')
        } catch {}
      }
    }
    return Promise.reject(error)
  }
)
