import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { zooApi } from '../api/zoo'
import { Species } from '../types'
import { UserRole } from '../types'
import Modal from '../components/Modal'
import SpeciesForm from '../components/SpeciesForm'
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

  const handleEdit = (s: Species) => {
    setEditingSpecies(s)
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

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 3 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Paper elevation={3} sx={{ p: 3, mb: 2, borderRadius: 2 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{
              xs: 'flex-start',
              sm: 'center',
            }}
            justifyContent="space-between"
          >
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                background: 'linear-gradient(135deg, #5863f8 0%, #7b4ff1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Виды животных
            </Typography>
            <Stack direction="row" spacing={1}>
              {user && user.role === UserRole.ADMIN && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreate}
                  sx={{ borderRadius: 2 }}
                >
                  Добавить вид
                </Button>
              )}
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={loadSpecies}
                sx={{ borderRadius: 2 }}
              >
                Обновить
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {/* Search */}
        <Paper elevation={3} sx={{ p: 3, mb: 2, borderRadius: 2 }}>
          <TextField
            label="Поиск"
            placeholder="Поиск по названию вида..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Paper>

        {error && (
          <Paper
            elevation={1}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 2,
              bgcolor: '#ffebee',
              border: '1px solid #ffcdd2',
              color: '#c62828',
            }}
          >
            {error}
          </Paper>
        )}

        {/* Cards */}
        {isLoading ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 2,
            }}
          >
            Загрузка...
          </Paper>
        ) : species.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 2,
            }}
          >
            Виды не найдены
          </Paper>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 2,
              alignItems: 'stretch',
            }}
          >
            {species.map((s) => (
              <Card
                key={s.uuid}
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
                  <Typography
                    variant="h6"
                    sx={{ color: 'primary.main', fontWeight: 700 }}
                  >
                    {s.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', mb: 1, fontStyle: 'italic' }}
                  >
                    {s.scientific_name}
                  </Typography>
                  {s.description && (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {s.description}
                    </Typography>
                  )}
                  <Stack spacing={1} sx={{ color: 'text.secondary', mt: 1 }}>
                    {s.habitat && (
                      <Typography variant="body2">
                        <strong>Среда обитания:</strong> {s.habitat}
                      </Typography>
                    )}
                    {s.diet && (
                      <Typography variant="body2">
                        <strong>Питание:</strong> {s.diet}
                      </Typography>
                    )}
                    {s.conservation_status && (
                      <Typography variant="body2">
                        <strong>Статус сохранения:</strong> {s.conservation_status}
                      </Typography>
                    )}
                  </Stack>
                </CardContent>
                {user && user.role === UserRole.ADMIN && (
                  <CardActions sx={{ pt: 0 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ width: '100%' }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => handleEdit(s)}
                        sx={{ borderRadius: 2 }}
                      >
                        Редактировать
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        fullWidth
                        onClick={() => handleDelete(s.uuid)}
                        sx={{ borderRadius: 2 }}
                      >
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
          title={editingSpecies ? 'Редактировать вид' : 'Добавить вид'}
        >
          <SpeciesForm
            species={editingSpecies || undefined}
            onSave={handleSave}
            onCancel={handleModalClose}
          />
        </Modal>
      </Container>
    </Box>
  )
}

export default SpeciesPage
