import React, { useState } from 'react'
import { SpeciesCreate } from '../types'
import { zooApi } from '../api/zoo'
import toast from 'react-hot-toast'
import './Form.css'

interface SpeciesFormProps {
  species?: any
  onSave: () => void
  onCancel: () => void
}

const SpeciesForm: React.FC<SpeciesFormProps> = ({ species, onSave, onCancel }) => {
  const [formData, setFormData] = useState<SpeciesCreate>({
    name: species?.name || '',
    scientific_name: species?.scientific_name || '',
    description: species?.description || '',
    habitat: species?.habitat || '',
    diet: species?.diet || '',
    conservation_status: species?.conservation_status || '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (species) {
        await zooApi.updateSpecies(species.uuid, formData)
        toast.success('Вид обновлен')
      } else {
        await zooApi.createSpecies(formData)
        toast.success('Вид создан')
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
        <label>Название *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Научное название *</label>
        <input
          type="text"
          value={formData.scientific_name}
          onChange={(e) => setFormData({ ...formData, scientific_name: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Описание</label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value || null })}
          rows={4}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Среда обитания</label>
          <input
            type="text"
            value={formData.habitat || ''}
            onChange={(e) => setFormData({ ...formData, habitat: e.target.value || null })}
          />
        </div>

        <div className="form-group">
          <label>Питание</label>
          <input
            type="text"
            value={formData.diet || ''}
            onChange={(e) => setFormData({ ...formData, diet: e.target.value || null })}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Статус сохранения</label>
        <input
          type="text"
          value={formData.conservation_status || ''}
          onChange={(e) => setFormData({ ...formData, conservation_status: e.target.value || null })}
          placeholder="Например: LC, NT, VU, EN, CR"
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Отмена
        </button>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Сохранение...' : species ? 'Обновить' : 'Создать'}
        </button>
      </div>
    </form>
  )
}

export default SpeciesForm

