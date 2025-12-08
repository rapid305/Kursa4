import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { zooApi } from '../api/zoo'
import { Species } from '../types'
import { UserRole } from '../types'
import Modal from '../components/Modal'
import SpeciesForm from '../components/SpeciesForm'
import toast from 'react-hot-toast'
import './SpeciesPage.css'

const SpeciesPage = () => {
  const { user } = useAuth()
  const [species, setSpecies] = useState<Species[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSpecies, setEditingSpecies] = useState<Species | null>(null)

  useEffect(() => {
    loadSpecies()
  }, [search])

  const loadSpecies = async () => {
    try {
      setIsLoading(true)
      const data = await zooApi.getSpecies({
        search: search || undefined,
      })
      setSpecies(data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка загрузки видов')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (uuid: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот вид?')) {
      return
    }

    try {
      await zooApi.deleteSpecies(uuid)
      toast.success('Вид удален')
      loadSpecies()
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Ошибка удаления')
    }
  }

  const handleCreate = () => {
    setEditingSpecies(null)
    setIsModalOpen(true)
  }

  const handleEdit = (species: Species) => {
    setEditingSpecies(species)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingSpecies(null)
  }

  const handleSave = () => {
    setIsModalOpen(false)
    setEditingSpecies(null)
    loadSpecies()
  }

  if (isLoading) {
    return (
      <div className="species-page">
        <div className="species-container">
          <div className="loading">Загрузка...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="species-page">
      <div className="species-container">
        <header className="species-header">
          <h1>Виды животных</h1>
          <div className="header-actions">
            {user && user.role === UserRole.ADMIN && (
              <button onClick={handleCreate} className="btn btn-success">
                + Добавить вид
              </button>
            )}
            <button onClick={loadSpecies} className="btn btn-primary">
              Обновить
            </button>
          </div>
        </header>

        <div className="search-box">
          <input
            type="text"
            placeholder="Поиск по названию вида..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="species-grid">
          {species.map((s) => (
            <div key={s.uuid} className="species-card">
              <h3>{s.name}</h3>
              <p className="scientific-name"><em>{s.scientific_name}</em></p>
              {s.description && <p className="description">{s.description}</p>}
              <div className="species-details">
                {s.habitat && (
                  <p><strong>Среда обитания:</strong> {s.habitat}</p>
                )}
                {s.diet && (
                  <p><strong>Питание:</strong> {s.diet}</p>
                )}
                {s.conservation_status && (
                  <p><strong>Статус сохранения:</strong> {s.conservation_status}</p>
                )}
              </div>
              {user && user.role === UserRole.ADMIN && (
                <div className="species-actions">
                  <button
                    onClick={() => handleEdit(s)}
                    className="btn btn-edit btn-small"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleDelete(s.uuid)}
                    className="btn btn-danger btn-small"
                  >
                    Удалить
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {species.length === 0 && !isLoading && (
          <div className="empty-state">Виды не найдены</div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingSpecies ? 'Редактировать вид' : 'Добавить вид'}
      >
        <SpeciesForm
          species={editingSpecies || undefined}
          onSave={handleSave}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  )
}

export default SpeciesPage

