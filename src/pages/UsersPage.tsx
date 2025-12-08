import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { usersApi } from '../api/users'
import { User, UserRole } from '../types'
import './UsersPage.css'

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

  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'badge-admin'
      case UserRole.MODERATOR:
        return 'badge-moderator'
      default:
        return 'badge-user'
    }
  }

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'Администратор'
      case UserRole.MODERATOR:
        return 'Модератор'
      default:
        return 'Пользователь'
    }
  }

  if (isLoading) {
    return (
      <div className="users-page">
        <div className="users-container">
          <div className="loading">Загрузка...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="users-page">
      <div className="users-container">
        <header className="users-header">
          <h1>Управление пользователями</h1>
          <button onClick={loadUsers} className="btn btn-primary">
            Обновить
          </button>
        </header>

        {error && <div className="error-message">{error}</div>}

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Имя</th>
                <th>Email</th>
                <th>Роль</th>
                <th>Статус</th>
                <th>Дата создания</th>
                {currentUser?.role === UserRole.ADMIN && <th>Действия</th>}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.uuid}>
                  <td>{user.first_name} {user.last_name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td>
                    <span className={`status ${user.is_active ? 'active' : 'inactive'}`}>
                      {user.is_active ? 'Активен' : 'Неактивен'}
                    </span>
                  </td>
                  <td>{new Date(user.created_at).toLocaleDateString('ru-RU')}</td>
                  {currentUser?.role === UserRole.ADMIN && (
                    <td>
                      <button
                        onClick={() => handleDelete(user.uuid)}
                        className="btn btn-danger"
                        disabled={user.uuid === currentUser.uuid}
                      >
                        Удалить
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && !isLoading && (
          <div className="empty-state">Пользователи не найдены</div>
        )}
      </div>
    </div>
  )
}

export default UsersPage

