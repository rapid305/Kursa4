import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { UserRole } from '../types'
import './Header.css'

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

  const isActive = (path: string) => (location.pathname === path ? 'active' : '')

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo" title="На главную">
          <span className="logo-icon">🦁</span>
          <span className="logo-text">ZooSystem</span>
        </Link>

        {/* Navigation */}
        <nav className="header-nav">
          <Link to="/" className={`nav-link ${isActive('/')}`}>
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Домой</span>
          </Link>
          <Link to="/animals" className={`nav-link ${isActive('/animals')}`}>
            <span className="nav-icon">🐾</span>
            <span className="nav-text">Животные</span>
          </Link>
          <Link to="/species" className={`nav-link ${isActive('/species')}`}>
            <span className="nav-icon">🔬</span>
            <span className="nav-text">Виды</span>
          </Link>
          <Link to="/enclosures" className={`nav-link ${isActive('/enclosures')}`}>
            <span className="nav-icon">🏡</span>
            <span className="nav-text">Вольеры</span>
          </Link>
          {(user.role === UserRole.ADMIN || user.role === UserRole.MODERATOR) && (
            <Link to="/users" className={`nav-link ${isActive('/users')}`}>
              <span className="nav-icon">👥</span>
              <span className="nav-text">Пользователи</span>
            </Link>
          )}
        </nav>

        {/* Right actions: Dashboard shortcut, Theme toggle, User menu */}
        <div className="header-actions-right">
          <Link to="/dashboard" className={`btn btn-secondary btn-sm ${isActive('/dashboard')}`} title="Панель">
            📊 Панель
          </Link>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Темная тема' : 'Светлая тема'}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {/* User Dropdown */}
          <div className="user-dropdown">
            <div className="user-avatar" title={`${user.first_name} ${user.last_name}`}>
              {user.first_name[0]}{user.last_name[0]}
            </div>
            <div className="user-dropdown-content">
              <div className="user-dropdown-header">
                <strong>{user.first_name} {user.last_name}</strong>
                <span className="user-role">{user.role}</span>
              </div>
              <div className="user-dropdown-email">{user.email}</div>
              <hr className="user-dropdown-divider" />
              <button
                className="btn btn-secondary btn-sm btn-block"
                onClick={handleLogout}
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
