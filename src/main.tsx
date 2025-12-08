import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App.tsx'
import { ThemeProvider } from './contexts/ThemeContext'
import './styles/theme.css'
import './styles/buttons.css'
import './styles/forms.css'
import './styles/cards.css'
import './styles/tables.css'
import './styles/utilities.css'
import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster position="top-right" />
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
)

