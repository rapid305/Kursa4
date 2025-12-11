import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { zooApi } from '../api/zoo'
import { Enclosure } from '../types'
import { UserRole } from '../types'
import Modal from '../components/Modal'
import EnclosureForm from '../components/EnclosureForm'
import toast from 'react-hot-toast'
import {
  Box,
  Container,
  Paper,
  Typography,
  Stack,
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'

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

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 3 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Paper elevation={3} sx={{ p: 3, mb: 2, borderRadius: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
            <Typography variant="h4" fontWeight={800} sx={{
              background: 'linear-gradient(135deg, #5863f8 0%, #7b4ff1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Вольеры зоопарка
            </Typography>
            <Stack direction="row" spacing={1}>
              {user && user.role === UserRole.ADMIN && (
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate} sx={{ borderRadius: 2 }}>
                  Добавить вольер
                </Button>
              )}
              <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadEnclosures} sx={{ borderRadius: 2 }}>
                Обновить
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {/* Search */}
        <Paper elevation={3} sx={{ p: 3, mb: 2, borderRadius: 2 }}>
          <TextField
            label="Поиск"
            placeholder="Поиск по названию вольера..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Paper>

        {error && (
          <Paper elevation={1} sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: '#ffebee', border: '1px solid #ffcdd2', color: '#c62828' }}>
            {error}
          </Paper>
        )}

        {/* Cards */}
        {isLoading ? (
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>Загрузка...</Paper>
        ) : enclosures.length === 0 ? (
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>Вольеры не найдены</Paper>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
            {enclosures.map((enclosure) => (
              <Card
                key={enclosure.uuid}
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
                  <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700, mb: 1.5 }}>{enclosure.name}</Typography>
                  <Stack spacing={1} sx={{ color: 'text.secondary' }}>
                    <Typography variant="body2"><strong>Тип:</strong> {getEnclosureTypeLabel(enclosure.enclosure_type)}</Typography>
                    {enclosure.area && (
                      <Typography variant="body2"><strong>Площадь:</strong> {enclosure.area} м²</Typography>
                    )}
                    {enclosure.capacity && (
                      <Typography variant="body2"><strong>Вместимость:</strong> {enclosure.capacity} животных</Typography>
                    )}
                    {enclosure.location && (
                      <Typography variant="body2"><strong>Расположение:</strong> {enclosure.location}</Typography>
                    )}
                    {enclosure.description && (
                      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>{enclosure.description}</Typography>
                    )}
                  </Stack>
                </CardContent>
                {user && user.role === UserRole.ADMIN && (
                  <CardActions sx={{ pt: 0 }}>
                    <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                      <Button variant="contained" color="primary" fullWidth onClick={() => handleEdit(enclosure)} sx={{ borderRadius: 2 }}>
                        Редактировать
                      </Button>
                      <Button variant="contained" color="error" fullWidth onClick={() => handleDelete(enclosure.uuid)} sx={{ borderRadius: 2 }}>
                        Удалить
                      </Button>
                    </Stack>
                  </CardActions>
                )}
              </Card>
            ))}
          </Box>
        )}

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
      </Container>
    </Box>
  )
}

export default EnclosuresPage
