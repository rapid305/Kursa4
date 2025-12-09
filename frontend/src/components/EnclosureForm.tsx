import React, { useState } from 'react'
import { EnclosureCreate } from '../types'
import { zooApi } from '../api/zoo'
import toast from 'react-hot-toast'
import { Stack, TextField, Button, MenuItem } from '@mui/material'

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
    <Stack component="form" spacing={2} onSubmit={handleSubmit}>
      <TextField label="Название" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />

      <TextField select label="Тип" value={formData.enclosure_type} onChange={(e) => setFormData({ ...formData, enclosure_type: e.target.value })} required>
        <MenuItem value="indoor">Внутренний</MenuItem>
        <MenuItem value="outdoor">Наружный</MenuItem>
        <MenuItem value="mixed">Смешанный</MenuItem>
      </TextField>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField type="number" label="Площадь (м²)" inputProps={{ step: 0.01, min: 0 }} value={formData.area ?? ''} onChange={(e) => setFormData({ ...formData, area: e.target.value ? parseFloat(e.target.value) : null })} />
        <TextField type="number" label="Вместимость" inputProps={{ min: 0 }} value={formData.capacity ?? ''} onChange={(e) => setFormData({ ...formData, capacity: e.target.value ? parseInt(e.target.value) : null })} />
      </Stack>

      <TextField label="Расположение" value={formData.location ?? ''} onChange={(e) => setFormData({ ...formData, location: e.target.value || null })} />

      <TextField label="Описание" value={formData.description ?? ''} onChange={(e) => setFormData({ ...formData, description: e.target.value || null })} multiline rows={4} />

      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <Button type="button" variant="outlined" onClick={onCancel}>Отмена</Button>
        <Button type="submit" variant="contained" disabled={isLoading}>{isLoading ? 'Сохранение...' : enclosure ? 'Обновить' : 'Создать'}</Button>
      </Stack>
    </Stack>
  )
}

export default EnclosureForm

