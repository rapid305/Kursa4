import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { zooApi } from '../api/zoo'
import { Animal, Species, Enclosure } from '../types'
import { UserRole } from '../types'
import Modal from '../components/Modal'
import AnimalForm from '../components/AnimalForm'
import toast from 'react-hot-toast'
import {
  Box,
  Container,
  Paper,
  Typography,
  Stack,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  Chip,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import type { SelectChangeEvent } from '@mui/material/Select'

const AnimalsPage = () => {
  const { user } = useAuth()
  const { theme } = useTheme()
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

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return { bg: 'success.light', text: 'success.dark' }
      case 'sick':
        return { bg: 'error.light', text: 'error.dark' }
      case 'under_observation':
        return { bg: 'warning.light', text: 'warning.dark' }
      default:
        return { bg: 'action.hover', text: 'text.secondary' }
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 3 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Paper elevation={3} sx={{ p: 3, mb: 2, borderRadius: 2, backgroundImage: theme === 'dark' ? 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))' : 'linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0))' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
            <Typography variant="h4" fontWeight={800} sx={{
              background: 'linear-gradient(135deg, #5863f8 0%, #7b4ff1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Животные зоопарка
            </Typography>
            <Stack direction="row" spacing={1}>
              {user && user.role === UserRole.ADMIN && (
                  <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate} sx={{ borderRadius: 2 }}>
                    Добавить животное
                  </Button>
              )}
              <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadData} sx={{ borderRadius: 2 }}>
                Обновить
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {/* Filters */}
        <Paper elevation={3} sx={{ p: 3, mb: 2, borderRadius: 2 }}>
          <Stack spacing={2}>
            <TextField
                label="Поиск"
                placeholder="Поиск по имени животного или виду..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel id="species-label">Виды</InputLabel>
                <Select
                    labelId="species-label"
                    label="Виды"
                    value={selectedSpecies}
                    onChange={(e: SelectChangeEvent) => setSelectedSpecies(e.target.value as string)}
                    sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">Все виды</MenuItem>
                  {species.map((s) => (
                      <MenuItem key={s.uuid} value={s.uuid}>{s.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="enclosure-label">Вольеры</InputLabel>
                <Select
                    labelId="enclosure-label"
                    label="Вольеры"
                    value={selectedEnclosure}
                    onChange={(e: SelectChangeEvent) => setSelectedEnclosure(e.target.value as string)}
                    sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">Все вольеры</MenuItem>
                  {enclosures.map((e) => (
                      <MenuItem key={e.uuid} value={e.uuid}>{e.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </Paper>

        {error && (
            <Paper elevation={1} sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: '#ffebee', border: '1px solid #ffcdd2', color: '#c62828' }}>
              {error}
            </Paper>
        )}

        {/* Grid */}
        {isLoading ? (
            <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>Загрузка...</Paper>
        ) : animals.length === 0 ? (
            <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>Животные не найдены</Paper>
        ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                gap: 2,
                alignItems: 'stretch',
              }}
            >
              {animals.map((animal) => {
                const health = getHealthStatusColor(animal.health_status)
                return (
                  <Card
                    key={animal.uuid}
                    elevation={2}
                    sx={{
                      borderRadius: 2,
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'translateY(-2px)' },
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>{animal.name}</Typography>
                        <Chip label={getHealthStatusLabel(animal.health_status)} sx={{ bgcolor: health.bg, color: health.text }} />
                      </Stack>
                      <Stack spacing={1} sx={{ color: 'text.secondary' }}>
                        <Typography variant="body2"><strong>Вид:</strong> {animal.species?.name || 'Не указан'}</Typography>
                        <Typography variant="body2"><strong>Пол:</strong> {animal.gender === 'male' ? 'Самец' : animal.gender === 'female' ? 'Самка' : 'Неизвестно'}</Typography>
                        {animal.birth_date && (
                          <Typography variant="body2"><strong>Дата рождения:</strong> {new Date(animal.birth_date).toLocaleDateString('ru-RU')}</Typography>
                        )}
                        <Typography variant="body2"><strong>Дата поступления:</strong> {new Date(animal.arrival_date).toLocaleDateString('ru-RU')}</Typography>
                        {animal.enclosure && (
                          <Typography variant="body2"><strong>Вольер:</strong> {animal.enclosure.name}</Typography>
                        )}
                        {animal.description && (
                          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>{animal.description}</Typography>
                        )}
                      </Stack>
                    </CardContent>
                    {user && user.role === UserRole.ADMIN && (
                      <CardActions sx={{ pt: 0 }}>
                        <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                          <Button variant="contained" color="primary" fullWidth onClick={() => handleEdit(animal)} sx={{ borderRadius: 2 }}>
                            Редактировать
                          </Button>
                          <Button variant="contained" color="error" fullWidth onClick={() => handleDelete(animal.uuid)} sx={{ borderRadius: 2 }}>
                            Удалить
                          </Button>
                        </Stack>
                      </CardActions>
                    )}
                  </Card>
                )
              })}
            </Box>
        )}

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
      </Container>
    </Box>
  )
}

export default AnimalsPage
