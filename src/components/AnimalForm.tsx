import React, { useState, useEffect } from 'react'
import { AnimalCreate, Species, Enclosure } from '../types'
import { zooApi } from '../api/zoo'
import toast from 'react-hot-toast'
import {
  Stack,
  TextField,
  Button,
  MenuItem,
} from '@mui/material'

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
    <Stack component="form" spacing={2} onSubmit={handleSubmit}>
      <TextField label="Имя" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />

      <TextField select label="Пол" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} required>
        <MenuItem value="male">Самец</MenuItem>
        <MenuItem value="female">Самка</MenuItem>
        <MenuItem value="unknown">Неизвестно</MenuItem>
      </TextField>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField type="date" label="Дата рождения" value={formData.birth_date || ''} onChange={(e) => setFormData({ ...formData, birth_date: e.target.value || null })} InputLabelProps={{ shrink: true }} />
        <TextField type="date" label="Дата поступления" value={formData.arrival_date} onChange={(e) => setFormData({ ...formData, arrival_date: e.target.value })} InputLabelProps={{ shrink: true }} required />
      </Stack>

      <TextField select label="Статус здоровья" value={formData.health_status} onChange={(e) => setFormData({ ...formData, health_status: e.target.value })} required>
        <MenuItem value="healthy">Здоров</MenuItem>
        <MenuItem value="sick">Болен</MenuItem>
        <MenuItem value="under_observation">Под наблюдением</MenuItem>
      </TextField>

      <TextField select label="Вид" value={formData.species_uuid} onChange={(e) => setFormData({ ...formData, species_uuid: e.target.value })} required>
        <MenuItem value="">Выберите вид</MenuItem>
        {species.map((s) => (
          <MenuItem key={s.uuid} value={s.uuid}>{s.name}</MenuItem>
        ))}
      </TextField>

      <TextField select label="Вольер" value={formData.enclosure_uuid || ''} onChange={(e) => setFormData({ ...formData, enclosure_uuid: e.target.value || null })}>
        <MenuItem value="">Не указан</MenuItem>
        {enclosures.map((e) => (
          <MenuItem key={e.uuid} value={e.uuid}>{e.name}</MenuItem>
        ))}
      </TextField>

      <TextField label="Описание" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value || null })} multiline rows={4} />

      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <Button type="button" variant="outlined" onClick={onCancel}>Отмена</Button>
        <Button type="submit" variant="contained" disabled={isLoading}>{isLoading ? 'Сохранение...' : animal ? 'Обновить' : 'Создать'}</Button>
      </Stack>
    </Stack>
  )
}

export default AnimalForm

