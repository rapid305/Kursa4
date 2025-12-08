import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { zooApi } from '../api/zoo'
import { Animal, Species, Enclosure } from '../types'
import { UserRole } from '../types'
import Modal from '../components/Modal'
import AnimalForm from '../components/AnimalForm'
import toast from 'react-hot-toast'
import './AnimalsPage.css'

const AnimalsPage = () => {
  const { user } = useAuth()
  
  // Debug: проверка роли
  console.log('User:', user)
  console.log('User role:', user?.role)
  console.log('Is ADMIN?', user?.role === UserRole.ADMIN)
  const [animals, setAnimals] = useState<Animal[]>([])
  const [species, setSpecies] = useState<Species[]>([])
  const [enclosures, setEnclosures] = useState<Enclosure[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [selectedSpecies, setSelectedSpecies] = useState<string>('')
  const [selectedEnclosure, setSelectedEnclosure] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null)

  useEffect(() => {
    loadData()
  }, [selectedSpecies, selectedEnclosure, search])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [animalsData, speciesData, enclosuresData] = await Promise.all([
        zooApi.getAnimals({
          search: search || undefined,
          species_uuid: selectedSpecies || undefined,
          enclosure_uuid: selectedEnclosure || undefined,
        }),
        zooApi.getSpecies(),
        zooApi.getEnclosures(),
      ])
      setAnimals(animalsData)
      setSpecies(speciesData)
      setEnclosures(enclosuresData)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка загрузки данных')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (uuid: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить это животное?')) {
      return
    }

    try {
      await zooApi.deleteAnimal(uuid)
      toast.success('Животное удалено')
      loadData()
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Ошибка удаления')
    }
  }

  const handleCreate = () => {
    setEditingAnimal(null)
    setIsModalOpen(true)
  }

  const handleEdit = (animal: Animal) => {
    setEditingAnimal(animal)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingAnimal(null)
  }

  const handleSave = () => {
    setIsModalOpen(false)
    setEditingAnimal(null)
    loadData()
  }

  const getHealthStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      healthy: 'Здоров',
      sick: 'Болен',
      under_observation: 'Под наблюдением',
    }
    return labels[status] || status
  }

  const getHealthStatusClass = (status: string) => {
    const classes: Record<string, string> = {
      healthy: 'status-healthy',
      sick: 'status-sick',
      under_observation: 'status-observation',
    }
    return classes[status] || ''
  }

  if (isLoading) {
    return (
      <div className="animals-page">
        <div className="animals-container">
          <div className="loading">Загрузка...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="animals-page">
      <div className="animals-container">
        <header className="animals-header">
          <h1>Животные зоопарка</h1>
          <div className="header-actions">
            {user && user.role === UserRole.ADMIN && (
              <button onClick={handleCreate} className="btn btn-success">
                + Добавить животное
              </button>
            )}
            <button onClick={loadData} className="btn btn-primary">
              Обновить
            </button>
          </div>
        </header>

        <div className="search-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Поиск по имени животного или виду..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filters">
            <select
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value)}
              className="filter-select"
            >
              <option value="">Все виды</option>
              {species.map((s) => (
                <option key={s.uuid} value={s.uuid}>
                  {s.name}
                </option>
              ))}
            </select>
            <select
              value={selectedEnclosure}
              onChange={(e) => setSelectedEnclosure(e.target.value)}
              className="filter-select"
            >
              <option value="">Все вольеры</option>
              {enclosures.map((e) => (
                <option key={e.uuid} value={e.uuid}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="animals-grid">
          {animals.map((animal) => (
            <div key={animal.uuid} className="animal-card">
              <div className="animal-header">
                <h3>{animal.name}</h3>
                <span className={`health-status ${getHealthStatusClass(animal.health_status)}`}>
                  {getHealthStatusLabel(animal.health_status)}
                </span>
              </div>
              <div className="animal-info">
                <p><strong>Вид:</strong> {animal.species?.name || 'Не указан'}</p>
                <p><strong>Пол:</strong> {animal.gender === 'male' ? 'Самец' : animal.gender === 'female' ? 'Самка' : 'Неизвестно'}</p>
                {animal.birth_date && (
                  <p><strong>Дата рождения:</strong> {new Date(animal.birth_date).toLocaleDateString('ru-RU')}</p>
                )}
                <p><strong>Дата поступления:</strong> {new Date(animal.arrival_date).toLocaleDateString('ru-RU')}</p>
                {animal.enclosure && (
                  <p><strong>Вольер:</strong> {animal.enclosure.name}</p>
                )}
                {animal.description && (
                  <p className="animal-description">{animal.description}</p>
                )}
              </div>
              {user && user.role === UserRole.ADMIN && (
                <div className="animal-actions">
                  <button
                    onClick={() => handleEdit(animal)}
                    className="btn btn-edit btn-small"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleDelete(animal.uuid)}
                    className="btn btn-danger btn-small"
                  >
                    Удалить
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {animals.length === 0 && !isLoading && (
          <div className="empty-state">Животные не найдены</div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingAnimal ? 'Редактировать животное' : 'Добавить животное'}
      >
        <AnimalForm
          animal={editingAnimal || undefined}
          onSave={handleSave}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  )
}

export default AnimalsPage

