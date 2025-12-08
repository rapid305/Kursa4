import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { zooApi } from '../api/zoo'
import { Enclosure } from '../types'
import { UserRole } from '../types'
import Modal from '../components/Modal'
import EnclosureForm from '../components/EnclosureForm'
import toast from 'react-hot-toast'
import './EnclosuresPage.css'

const EnclosuresPage = () => {
  const { user } = useAuth()
  const [enclosures, setEnclosures] = useState<Enclosure[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEnclosure, setEditingEnclosure] = useState<Enclosure | null>(null)

  useEffect(() => {
    loadEnclosures()
  }, [search])

  const loadEnclosures = async () => {
    try {
      setIsLoading(true)
      const data = await zooApi.getEnclosures({
        search: search || undefined,
      })
      setEnclosures(data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка загрузки вольеров')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (uuid: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот вольер?')) {
      return
    }

    try {
      await zooApi.deleteEnclosure(uuid)
      toast.success('Вольер удален')
      loadEnclosures()
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Ошибка удаления')
    }
  }

  const handleCreate = () => {
    setEditingEnclosure(null)
    setIsModalOpen(true)
  }

  const handleEdit = (enclosure: Enclosure) => {
    setEditingEnclosure(enclosure)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingEnclosure(null)
  }

  const handleSave = () => {
    setIsModalOpen(false)
    setEditingEnclosure(null)
    loadEnclosures()
  }

  const getEnclosureTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      indoor: 'Внутренний',
      outdoor: 'Наружный',
      mixed: 'Смешанный',
    }
    return labels[type] || type
  }

  if (isLoading) {
    return (
      <div className="enclosures-page">
        <div className="enclosures-container">
          <div className="loading">Загрузка...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="enclosures-page">
      <div className="enclosures-container">
        <header className="enclosures-header">
          <h1>Вольеры зоопарка</h1>
          <div className="header-actions">
            {user && user.role === UserRole.ADMIN && (
              <button onClick={handleCreate} className="btn btn-success">
                + Добавить вольер
              </button>
            )}
            <button onClick={loadEnclosures} className="btn btn-primary">
              Обновить
            </button>
          </div>
        </header>

        <div className="search-box">
          <input
            type="text"
            placeholder="Поиск по названию вольера..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="enclosures-grid">
          {enclosures.map((enclosure) => (
            <div key={enclosure.uuid} className="enclosure-card">
              <h3>{enclosure.name}</h3>
              <div className="enclosure-info">
                <p><strong>Тип:</strong> {getEnclosureTypeLabel(enclosure.enclosure_type)}</p>
                {enclosure.area && (
                  <p><strong>Площадь:</strong> {enclosure.area} м²</p>
                )}
                {enclosure.capacity && (
                  <p><strong>Вместимость:</strong> {enclosure.capacity} животных</p>
                )}
                {enclosure.location && (
                  <p><strong>Расположение:</strong> {enclosure.location}</p>
                )}
                {enclosure.description && (
                  <p className="description">{enclosure.description}</p>
                )}
              </div>
              {user && user.role === UserRole.ADMIN && (
                <div className="enclosure-actions">
                  <button
                    onClick={() => handleEdit(enclosure)}
                    className="btn btn-edit btn-small"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleDelete(enclosure.uuid)}
                    className="btn btn-danger btn-small"
                  >
                    Удалить
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {enclosures.length === 0 && !isLoading && (
          <div className="empty-state">Вольеры не найдены</div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingEnclosure ? 'Редактировать вольер' : 'Добавить вольер'}
      >
        <EnclosureForm
          enclosure={editingEnclosure || undefined}
          onSave={handleSave}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  )
}

export default EnclosuresPage

