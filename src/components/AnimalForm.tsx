import React, { useState, useEffect } from 'react'
import { AnimalCreate, Species, Enclosure } from '../types'
import { zooApi } from '../api/zoo'
import toast from 'react-hot-toast'
import './Form.css'

interface AnimalFormProps {
  animal?: any
  onSave: () => void
  onCancel: () => void
}

const AnimalForm: React.FC<AnimalFormProps> = ({ animal, onSave, onCancel }) => {
  const [species, setSpecies] = useState<Species[]>([])
  const [enclosures, setEnclosures] = useState<Enclosure[]>([])
  const [formData, setFormData] = useState<AnimalCreate>({
    name: animal?.name || '',
    gender: animal?.gender || 'male',
    birth_date: animal?.birth_date || '',
    arrival_date: animal?.arrival_date || new Date().toISOString().split('T')[0],
    health_status: animal?.health_status || 'healthy',
    description: animal?.description || '',
    species_uuid: animal?.species_uuid || '',
    enclosure_uuid: animal?.enclosure_uuid || '',
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [speciesData, enclosuresData] = await Promise.all([
        zooApi.getSpecies(),
        zooApi.getEnclosures(),
      ])
      setSpecies(speciesData)
      setEnclosures(enclosuresData)
    } catch (error) {
      toast.error('Ошибка загрузки данных')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (animal) {
        await zooApi.updateAnimal(animal.uuid, formData)
        toast.success('Животное обновлено')
      } else {
        await zooApi.createAnimal(formData)
        toast.success('Животное создано')
      }
      onSave()
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Ошибка сохранения')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label>Имя *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Пол *</label>
        <select
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          required
        >
          <option value="male">Самец</option>
          <option value="female">Самка</option>
          <option value="unknown">Неизвестно</option>
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Дата рождения</label>
          <input
            type="date"
            value={formData.birth_date || ''}
            onChange={(e) => setFormData({ ...formData, birth_date: e.target.value || null })}
          />
        </div>

        <div className="form-group">
          <label>Дата поступления *</label>
          <input
            type="date"
            value={formData.arrival_date}
            onChange={(e) => setFormData({ ...formData, arrival_date: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Статус здоровья *</label>
        <select
          value={formData.health_status}
          onChange={(e) => setFormData({ ...formData, health_status: e.target.value })}
          required
        >
          <option value="healthy">Здоров</option>
          <option value="sick">Болен</option>
          <option value="under_observation">Под наблюдением</option>
        </select>
      </div>

      <div className="form-group">
        <label>Вид *</label>
        <select
          value={formData.species_uuid}
          onChange={(e) => setFormData({ ...formData, species_uuid: e.target.value })}
          required
        >
          <option value="">Выберите вид</option>
          {species.map((s) => (
            <option key={s.uuid} value={s.uuid}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Вольер</label>
        <select
          value={formData.enclosure_uuid || ''}
          onChange={(e) => setFormData({ ...formData, enclosure_uuid: e.target.value || null })}
        >
          <option value="">Не указан</option>
          {enclosures.map((e) => (
            <option key={e.uuid} value={e.uuid}>
              {e.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Описание</label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value || null })}
          rows={4}
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Отмена
        </button>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Сохранение...' : animal ? 'Обновить' : 'Создать'}
        </button>
      </div>
    </form>
  )
}

export default AnimalForm

