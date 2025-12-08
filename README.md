# ZooSystem Frontend 🦁

Современное веб-приложение для управления зоопарком с поддержкой светлой и темной темы.

## 🌟 Особенности

- ✅ Светлая и темная тема
- ✅ Адаптивный дизайн (мобильные, планшеты, десктоп)
- ✅ Красивые UI компоненты
- ✅ Система разграничения прав доступа
- ✅ Быстрое отображение благодаря React Query
- ✅ TypeScript для типобезопасности

## 📦 Установка

```bash
cd frontend

# Установить зависимости
npm install

# Запустить dev сервер
npm run dev

# Собрать для продакшена
npm build

# Предпросмотр собранного приложения
npm run preview
```

## 🎨 Система тем

Приложение поддерживает две темы:

### Светлая тема (Light)
- Белые фоны
- Темный текст
- Мягкие тени
- Оптимальна для дневного использования

### Темная тема (Dark)
- Темные фоны (#1a1a2e)
- Светлый текст
- Приглушенные тени
- Оптимальна для ночного использования

Переключение тем происходит кнопкой в header приложения. Выбор сохраняется в localStorage.

```tsx
import { useTheme } from '@/contexts/ThemeContext'

function MyComponent() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <button onClick={toggleTheme}>
      {theme === 'light' ? '🌙 Темная' : '☀️ Светлая'}
    </button>
  )
}
```

## 🧩 UI Компоненты

### Header
Основной навигационный компонент с:
- Логотипом
- Навигацией
- Кнопкой переключения темы
- Меню пользователя

```tsx
import Header from '@/components/Header'

<Header /> // Автоматически видна для авторизованных пользователей
```

### Modal
Модальное окно для диалогов и форм.

```tsx
import Modal from '@/components/Modal'

const [isOpen, setIsOpen] = useState(false)

<Modal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)} 
  title="Заголовок"
  size="md" // sm | md | lg
>
  Содержимое модального окна
</Modal>
```

### Loading
Индикатор загрузки.

```tsx
import Loading from '@/components/Loading'

// Компактный спиннер
<Loading size="sm" message="Загрузка..." />

// Полноэкранный спиннер
<Loading fullscreen message="Загрузка данных..." />
```

### Alert
Уведомления и предупреждения.

```tsx
import Alert from '@/components/Alert'

<Alert 
  type="success" 
  title="Успех!" 
  message="Операция выполнена успешно"
  onClose={() => dismissAlert()}
/>

// Типы: success, error, warning, info
```

### Pagination
Навигация по страницам с умными кнопками.

```tsx
import Pagination from '@/components/Pagination'

<Pagination 
  currentPage={page}
  totalPages={Math.ceil(total / limit)}
  onPageChange={setPage}
  totalItems={total}
  itemsPerPage={limit}
/>
```

## 🎯 Стили и утилиты

### CSS Переменные

Все цвета и размеры определены как переменные CSS и автоматически переключаются в зависимости от темы.

```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --success-color: #10b981;
  --error-color: #ef4444;
  --warning-color: #f59e0b;
  /* ... и многое другое */
}
```

### Утилиты CSS

```html
<!-- Сетка -->
<div class="grid grid-3 gap-2">
  <div class="card">Карточка 1</div>
  <div class="card">Карточка 2</div>
  <div class="card">Карточка 3</div>
</div>

<!-- Flexbox -->
<div class="flex flex-between gap-2">
  <span>Левый</span>
  <span>Правый</span>
</div>

<!-- Spacing -->
<div class="p-3 mb-2">Содержимое с отступами</div>

<!-- Text utilities -->
<h1 class="text-lg font-bold text-primary">Заголовок</h1>
<p class="text-secondary text-sm">Описание</p>
```

## 📐 Кнопки

```tsx
// Первичная кнопка
<button class="btn btn-primary">Сохранить</button>

// Вторичная кнопка
<button class="btn btn-secondary">Отмена</button>

// Успех
<button class="btn btn-success">Подтвердить</button>

// Ошибка/Опасность
<button class="btn btn-error">Удалить</button>
<button class="btn btn-danger">Критическое действие</button>

// Warning
<button class="btn btn-warning">Внимание</button>

// Размеры
<button class="btn btn-primary btn-sm">Маленькая</button>
<button class="btn btn-primary btn-lg">Большая</button>
<button class="btn btn-primary btn-block">Во всю ширину</button>

// Ghost (прозрачная)
<button class="btn btn-ghost">Прозрачная</button>

// Link (как ссылка)
<button class="btn btn-link">Как ссылка</button>
```

## 📝 Формы

```tsx
<form class="form">
  <div class="form-group">
    <label for="name">Имя</label>
    <input type="text" id="name" required />
    <p class="form-help">Ваше полное имя</p>
  </div>

  <div class="form-row">
    <div class="form-group">
      <label for="email">Email</label>
      <input type="email" id="email" required />
    </div>
    <div class="form-group">
      <label for="phone">Телефон</label>
      <input type="tel" id="phone" />
    </div>
  </div>

  <div class="form-group">
    <label for="message">Сообщение</label>
    <textarea id="message"></textarea>
  </div>

  <div class="form-actions">
    <button type="submit" class="btn btn-primary">Отправить</button>
    <button type="reset" class="btn btn-secondary">Очистить</button>
  </div>
</form>
```

## 🎴 Карточки

```tsx
// Простая карточка
<div class="card">
  <h3>Заголовок</h3>
  <p>Содержимое</p>
</div>

// С вариантом
<div class="card primary">
  <h3>Primary</h3>
</div>

<div class="card success">
  <h3>Success</h3>
</div>

// С сеткой
<div class="card-grid">
  <div class="card">Карточка 1</div>
  <div class="card">Карточка 2</div>
  <div class="card">Карточка 3</div>
</div>

// Статистические карточки
<div class="card stat-card">
  <div class="stat-icon">📊</div>
  <div class="stat-content">
    <span class="stat-value">150</span>
    <span class="stat-label">Животных</span>
  </div>
</div>
```

## 📊 Таблицы

```tsx
<div class="table-container">
  <table class="table table-striped">
    <thead>
      <tr>
        <th>Имя</th>
        <th>Email</th>
        <th class="text-right hide-mobile">Действия</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Иван</td>
        <td>ivan@example.com</td>
        <td class="text-right hide-mobile">
          <button class="btn btn-sm btn-primary">Редактировать</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

## 📱 Адаптивность

### Точки останова

- **Mobile**: до 480px
- **Tablet**: 480px - 768px
- **Desktop**: 768px - 1200px
- **Large Desktop**: 1200px+

### Утилиты для адаптивности

```html
<!-- Скрыть на мобильных -->
<div class="hide-mobile">Видно только на десктопе</div>

<!-- Показать на мобильных -->
<div class="show-mobile">Видно только на мобильном</div>

<!-- Адаптивная сетка -->
<div class="grid grid-3">
  <!-- 3 колонки на десктопе, 1 на мобильном -->
</div>
```

## 🔐 Аутентификация

```tsx
import { useAuth } from '@/contexts/AuthContext'

function ProtectedComponent() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <div>
      <p>Добро пожаловать, {user.first_name}!</p>
      <button onClick={logout}>Выйти</button>
    </div>
  )
}
```

## 🚀 Production Build

```bash
npm run build
```

Собранное приложение находится в папке `dist/` и готово к развертыванию.

## 📚 Структура проекта

```
frontend/
├── src/
│   ├── components/        # React компоненты
│   │   ├── Header.tsx
│   │   ├── Modal.tsx
│   │   ├── Loading.tsx
│   │   ├── Alert.tsx
│   │   ├── Pagination.tsx
│   │   └── ...
│   ├── contexts/          # React Context
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── pages/             # Страницы приложения
│   ├── api/               # API клиент
│   ├── types/             # TypeScript типы
│   ├── styles/            # CSS стили
│   │   ├── theme.css
│   │   ├── buttons.css
│   │   ├── forms.css
│   │   ├── cards.css
│   │   ├── tables.css
│   │   └── utilities.css
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🎨 Цветовая схема

### Светлая тема
- Primary: #667eea
- Secondary: #764ba2
- Success: #10b981
- Warning: #f59e0b
- Error: #ef4444

### Темная тема
- Background Primary: #1a1a2e
- Background Secondary: #16213e
- Text Primary: #f3f4f6
- Accent: #667eea

## 📞 Поддержка

Если у вас есть вопросы или проблемы, откройте issue на GitHub.

## 📄 Лицензия

MIT

