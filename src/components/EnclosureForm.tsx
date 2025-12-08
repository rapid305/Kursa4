import React, { useState } from 'react'
import { EnclosureCreate } from '../types'
import { zooApi } from '../api/zoo'
import toast from 'react-hot-toast'
import './Form.css'

interface EnclosureFormProps {
  enclosure?: any
  onSave: () => void
  onCancel: () => void
}

const EnclosureForm: React.FC<EnclosureFormProps> = ({ enclosure, onSave, onCancel }) => {
  const [formData, setFormData] = useState<EnclosureCreate>({
    name: enclosure?.name || '',
    enclosure_type: enclosure?.enclosure_type || 'outdoor',
    area: enclosure?.area || null,
    capacity: enclosure?.capacity || null,
    description: enclosure?.description || '',
    location: enclosure?.location || '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (enclosure) {
        await zooApi.updateEnclosure(enclosure.uuid, formData)
        toast.success('Вольер обновлен')
      } else {
        await zooApi.createEnclosure(formData)
        toast.success('Вольер создан')
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
        <label>Тип *</label>
        <select
          value={formData.enclosure_type}
          onChange={(e) => setFormData({ ...formData, enclosure_type: e.target.value })}
          required
        >
          <option value="indoor">Внутренний</option>
          <option value="outdoor">Наружный</option>
          <option value="mixed">Смешанный</option>
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Площадь (м²)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.area || ''}
            onChange={(e) => setFormData({ ...formData, area: e.target.value ? parseFloat(e.target.value) : null })}
          />
        </div>

        <div className="form-group">
          <label>Вместимость</label>
          <input
            type="number"
            min="0"
            value={formData.capacity || ''}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value ? parseInt(e.target.value) : null })}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Расположение</label>
        <input
          type="text"
          value={formData.location || ''}
          onChange={(e) => setFormData({ ...formData, location: e.target.value || null })}
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

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Отмена
        </button>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Сохранение...' : enclosure ? 'Обновить' : 'Создать'}
        </button>
      </div>
    </form>
  )
}

export default EnclosureForm

