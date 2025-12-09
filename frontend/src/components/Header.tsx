import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { UserRole } from '../types'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Stack,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import HomeIcon from '@mui/icons-material/Home'
import PetsIcon from '@mui/icons-material/Pets'
import ScienceIcon from '@mui/icons-material/Science'
import ParkIcon from '@mui/icons-material/Park'
import PeopleIcon from '@mui/icons-material/People'
import MenuIcon from '@mui/icons-material/Menu'
import { useState } from 'react'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'

const Header = () => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) return null

  const isActive = (path: string) => location.pathname === path

  const navItems = [
    { to: '/', label: 'Домой', icon: <HomeIcon /> },
    { to: '/animals', label: 'Животные', icon: <PetsIcon /> },
    { to: '/species', label: 'Виды', icon: <ScienceIcon /> },
    { to: '/enclosures', label: 'Вольеры', icon: <ParkIcon /> },
    ...(user.role === UserRole.ADMIN || user.role === UserRole.MODERATOR
      ? [{ to: '/users', label: 'Пользователи', icon: <PeopleIcon /> }]
      : []),
  ]

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [navAnchor, setNavAnchor] = useState<null | HTMLElement>(null)
  const [adminMenuAnchor, setAdminMenuAnchor] = useState<null | HTMLElement>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleNavOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNavAnchor(event.currentTarget)
  }

  const handleNavClose = () => {
    setNavAnchor(null)
  }

  const handleAdminMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAdminMenuAnchor(event.currentTarget)
  }

  const handleAdminMenuClose = () => {
    setAdminMenuAnchor(null)
  }

  return (
    <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: 'background.paper' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h6" component={Link} to="/" color="inherit" sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 1 }}>
            <span role="img" aria-label="Logo">🦁</span>
            ZooSystem
          </Typography>

          <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
            {navItems.map(({ to, label, icon }) => (
              <Button
                key={to}
                component={Link}
                to={to}
                variant={isActive(to) ? 'contained' : 'text'}
                color="primary"
                startIcon={icon}
              >
                {label}
              </Button>
            ))}
          </Stack>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton sx={{ display: { xs: 'inline-flex', md: 'none' }, ml: 1 }} color="inherit" onClick={handleNavOpen}>
            <MenuIcon />
          </IconButton>

          <Menu anchorEl={navAnchor} open={Boolean(navAnchor)} onClose={handleNavClose}>
            {navItems.map(({ to, label }) => (
              <MenuItem
                key={to}
                onClick={() => {
                  navigate(to)
                  handleNavClose()
                }}
              >
                {label}
              </MenuItem>
            ))}
          </Menu>

          <IconButton onClick={toggleTheme} color="inherit">
            {theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          {user.role === UserRole.ADMIN && (
            <>
              <IconButton color="inherit" onClick={handleAdminMenuOpen}>
                <SupervisorAccountIcon />
              </IconButton>
              <Menu
                anchorEl={adminMenuAnchor}
                open={Boolean(adminMenuAnchor)}
                onClose={handleAdminMenuClose}
              >
                <MenuItem
                  onClick={() => {
                    navigate('/users')
                    handleAdminMenuClose()
                  }}
                >
                  <PeopleIcon sx={{ mr: 1 }} />
                  Пользователи
                </MenuItem>
              </Menu>
            </>
          )}

          <IconButton onClick={handleMenuOpen}>
            <Avatar sx={{ width: 32, height: 32 }}>{user.first_name[0]}</Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem disabled>
              {user.first_name} {user.last_name}
            </MenuItem>
            <MenuItem onClick={handleLogout}>Выйти</MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

export default Header
