import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { UserRole } from '../types'
import './DashboardPage.css'
import { useTheme } from '../contexts/ThemeContext'
import { useEffect, useState } from 'react'
import axios from 'axios'

const DashboardPage = () => {
  const { user } = useAuth()
  const { theme } = useTheme()
  const [stats, setStats] = useState({ animals: 0, users: 0, enclosures: 0, species: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/stats/')
        setStats(response.data)
      } catch (error) {
        console.error('Ошибка при загрузке статистики:', error)
      }
    }

    fetchStats()
  }, [])

  if (!user) return null

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return '#ef4444'
      case UserRole.MODERATOR:
        return '#f59e0b'
      default:
        return '#10b981'
    }
  }

  return (
    <div className={`dashboard-page ${theme}`}>
      <div className="dashboard-container">
        {/* Welcome Card */}
        <div className="card welcome-card">
          <div className="welcome-header">
            <div className="welcome-content">
              <h1>Добро пожаловать, {user.first_name}! 👋</h1>
              <p>Добро пожаловать в систему управления зоопарком</p>
            </div>
            <div className="welcome-badge" style={{ backgroundColor: getRoleColor(user.role) }}>
              {user.role === UserRole.ADMIN && '👑'}
              {user.role === UserRole.MODERATOR && '🎯'}
              {user.role === UserRole.USER && '👤'}
              <span>{user.role.toUpperCase()}</span>
            </div>
          </div>

          <div className="user-info-grid">
            <div className="info-item">
              <span className="info-label">Email</span>
              <span className="info-value">{user.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Имя</span>
              <span className="info-value">{user.first_name} {user.last_name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Статус</span>
              <span className="info-value">
                <span className="status-badge active">✓ Активен</span>
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="dashboard-section">
          <h2 className="section-title">Основные разделы</h2>
          <div className="dashboard-cards">
            <Link to="/animals" className="card dashboard-card animals-card">
              <div className="card-icon">🐾</div>
              <h3>Животные</h3>
              <p>Просмотр и управление животными в зоопарке</p>
              <span className="card-arrow">→</span>
            </Link>

            <Link to="/species" className="card dashboard-card species-card">
              <div className="card-icon">🔬</div>
              <h3>Виды животных</h3>
              <p>Каталог видов с научной информацией</p>
              <span className="card-arrow">→</span>
            </Link>

            <Link to="/enclosures" className="card dashboard-card enclosures-card">
              <div className="card-icon">🏠</div>
              <h3>Вольеры</h3>
              <p>Управление вольерами и условиями</p>
              <span className="card-arrow">→</span>
            </Link>

            {(user.role === UserRole.ADMIN || user.role === UserRole.MODERATOR) && (
              <Link to="/users" className="card dashboard-card users-card">
                <div className="card-icon">👥</div>
                <h3>Пользователи</h3>
                <p>Управление пользователями системы</p>
                <span className="card-arrow">→</span>
              </Link>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="dashboard-section">
          <h2 className="section-title">Статистика</h2>
          <div className="stats-cards">
            <div className="card stat-card">
              <div className="stat-icon">🦁</div>
              <div className="stat-content">
                <span className="stat-value">{stats.animals}</span>
                <span className="stat-label">Животных</span>
              </div>
            </div>
            <div className="card stat-card">
              <div className="stat-icon">🌿</div>
              <div className="stat-content">
                <span className="stat-value">{stats.species}</span>
                <span className="stat-label">Видов</span>
              </div>
            </div>
            <div className="card stat-card">
              <div className="stat-icon">🏘️</div>
              <div className="stat-content">
                <span className="stat-value">{stats.enclosures}</span>
                <span className="stat-label">Вольеров</span>
              </div>
            </div>
            <div className="card stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <span className="stat-value">{stats.users}</span>
                <span className="stat-label">Пользователей</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
