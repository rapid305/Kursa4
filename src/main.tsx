import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { ThemeProvider as AppThemeProvider, useTheme } from './contexts/ThemeContext'
import { ThemeProvider as MUIThemeProvider, createTheme, CssBaseline } from '@mui/material'

const queryClient = new QueryClient()

function ThemeBridge({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()
  const muiTheme = React.useMemo(() => createTheme({
    palette: {
      mode: theme,
      primary: { main: '#5863f8' },
      secondary: { main: '#7b4ff1' },
      ...(theme === 'dark' ? {
        background: { default: '#0b0f19', paper: '#111827' },
        text: { primary: '#E5E7EB', secondary: '#9CA3AF' },
        success: { main: '#22c55e' },
        warning: { main: '#f59e0b' },
        error: { main: '#ef4444' },
      } : {
        background: { default: '#f3f4f6', paper: '#ffffff' },
        text: { primary: '#111827', secondary: '#6b7280' },
        success: { main: '#16a34a' },
        warning: { main: '#d97706' },
        error: { main: '#dc2626' },
      }),
    },
    shape: { borderRadius: 12 },
    typography: {
      fontWeightBold: 800,
      h4: { fontWeight: 800 },
      h5: { fontWeight: 800 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundImage: theme === 'dark'
              ? 'radial-gradient(1000px 400px at 100% -100px, rgba(88,99,248,0.08), transparent), radial-gradient(800px 400px at -100px 100%, rgba(123,79,241,0.08), transparent)'
              : 'radial-gradient(1000px 400px at 100% -100px, rgba(88,99,248,0.06), transparent), radial-gradient(800px 400px at -100px 100%, rgba(123,79,241,0.06), transparent)'
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          colorDefault: {
            backgroundColor: theme === 'dark' ? '#0f1424' : '#ffffff',
            transition: 'background-color 200ms ease',
            borderBottom: theme === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
            backdropFilter: 'saturate(180%) blur(8px)'
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: theme === 'dark' ? '0 6px 16px rgba(0,0,0,0.35)' : '0 6px 16px rgba(0,0,0,0.06)',
            backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
            borderRadius: 16,
            border: theme === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
            transition: 'transform 160ms ease, box-shadow 160ms ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: theme === 'dark' ? '0 8px 20px rgba(0,0,0,0.45)' : '0 8px 20px rgba(0,0,0,0.1)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 18,
            border: theme === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
            transition: 'transform 160ms ease, box-shadow 160ms ease',
            backgroundImage: theme === 'dark'
              ? 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.0))'
              : 'linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.0))',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: theme === 'dark' ? '0 10px 24px rgba(0,0,0,0.5)' : '0 10px 24px rgba(0,0,0,0.12)',
            },
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            paddingBottom: 16,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 12,
            fontWeight: 700,
            transition: 'transform 100ms ease, box-shadow 160ms ease, background 160ms ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: theme === 'dark' ? '0 6px 14px rgba(0,0,0,0.5)' : '0 6px 14px rgba(0,0,0,0.12)',
            },
          },
          containedPrimary: {
            background: 'linear-gradient(135deg, #5863f8 0%, #7b4ff1 100%)',
          },
          outlined: {
            borderWidth: 2,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: theme === 'dark' ? '#0f172a' : '#fff',
            transition: 'background-color 160ms ease, box-shadow 160ms ease',
            '&.Mui-focused': {
              boxShadow: theme === 'dark' ? '0 0 0 3px rgba(88,99,248,0.35)' : '0 0 0 3px rgba(88,99,248,0.2)',
            },
          },
          notchedOutline: {
            borderColor: theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 700,
            borderRadius: 10,
          },
        },
      },
      MuiTextField: {
        defaultProps: { size: 'medium' },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
            borderRadius: 12,
            border: theme === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)'
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:nth-of-type(odd)': {
              backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
            }
          }
        }
      }
    },
  }), [theme])

  return (
    <MUIThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppThemeProvider>
      <ThemeBridge>
        <QueryClientProvider client={queryClient}>
          <App />
          <Toaster position="top-right" />
        </QueryClientProvider>
      </ThemeBridge>
    </AppThemeProvider>
  </React.StrictMode>,
)
