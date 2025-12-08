import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './HomePage.css'

const HomePage = () => {
  const { user } = useAuth()

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-content">
          <h1 className="home-title">Информационно-поисковая система «Зоопарк»</h1>
          <p className="home-subtitle">
            Система управления информацией о животных, видах и вольерах зоопарка
          </p>

          <div className="home-info">
            <h2>Назначение приложения</h2>
            <p>
              Информационно-поисковая система «Зоопарк» предназначена для управления и поиска информации
              о животных, содержащихся в зоопарке. Система позволяет вести учет животных, их видов,
              вольеров, а также обеспечивает многопользовательский доступ с разграничением прав доступа.
              Приложение построено на современном стеке технологий: FastAPI для backend и React с TypeScript
              для frontend.
            </p>

            <h2>Основные возможности</h2>
            <ul>
              <li>Поиск и просмотр информации о животных зоопарка</li>
              <li>Управление каталогом видов животных</li>
              <li>Управление вольерами и их характеристиками</li>
              <li>Регистрация и авторизация пользователей</li>
              <li>Система ролей (Администратор, Модератор, Пользователь)</li>
              <li>Разграничение прав доступа по ролям</li>
              <li>Фильтрация и поиск по различным критериям</li>
            </ul>

            <h2>Технологии</h2>
            <div className="tech-stack">
              <div className="tech-item">
                <strong>Backend:</strong> Python, FastAPI, SQLAlchemy, PostgreSQL, JWT
              </div>
              <div className="tech-item">
                <strong>Frontend:</strong> React, TypeScript, React Router, Axios
              </div>
            </div>

            <h2>Функциональность системы</h2>
            <ul>
              <li><strong>Животные:</strong> Просмотр списка животных, поиск по имени или виду, фильтрация по виду и вольеру</li>
              <li><strong>Виды:</strong> Каталог видов животных с научными названиями, описаниями и статусом сохранения</li>
              <li><strong>Вольеры:</strong> Информация о вольерах, их типе, площади и вместимости</li>
              <li><strong>Поиск:</strong> Быстрый поиск по всем категориям данных</li>
            </ul>

            <h2>Об авторе</h2>
            <p>
              Информационно-поисковая система «Зоопарк» разработана в рамках курсовой работы.
              Система реализует все требования по безопасности, многопользовательскому доступу,
              разграничению прав пользователей и предоставляет удобный интерфейс для работы с данными зоопарка.
            </p>
          </div>

          <div className="home-actions">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary">
                Перейти в панель управления
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary">
                  Войти
                </Link>
                <Link to="/register" className="btn btn-secondary">
                  Зарегистрироваться
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage

