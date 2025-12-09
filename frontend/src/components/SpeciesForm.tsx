import React, { useState } from 'react'
import { SpeciesCreate } from '../types'
import { zooApi } from '../api/zoo'
import toast from 'react-hot-toast'
import { Stack, TextField, Button } from '@mui/material'

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
    <Stack component="form" spacing={2} onSubmit={handleSubmit}>
      <TextField label="Название" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />

      <TextField label="Научное название" value={formData.scientific_name} onChange={(e) => setFormData({ ...formData, scientific_name: e.target.value })} required />

      <TextField label="Описание" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value || null })} multiline rows={4} />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField label="Среда обитания" value={formData.habitat || ''} onChange={(e) => setFormData({ ...formData, habitat: e.target.value || null })} />
        <TextField label="Питание" value={formData.diet || ''} onChange={(e) => setFormData({ ...formData, diet: e.target.value || null })} />
      </Stack>

      <TextField label="Статус сохранения" value={formData.conservation_status || ''} onChange={(e) => setFormData({ ...formData, conservation_status: e.target.value || null })} placeholder="Например: LC, NT, VU, EN, CR" />

      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <Button type="button" variant="outlined" onClick={onCancel}>Отмена</Button>
        <Button type="submit" variant="contained" disabled={isLoading}>{isLoading ? 'Сохранение...' : species ? 'Обновить' : 'Создать'}</Button>
      </Stack>
    </Stack>
  )
}

export default SpeciesForm

