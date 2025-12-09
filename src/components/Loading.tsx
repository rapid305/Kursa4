import { Box, CircularProgress, Typography } from '@mui/material'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  fullscreen?: boolean
  message?: string
}

const sizeMap = {
  sm: 24,
  md: 40,
  lg: 64,
} as const

const Loading = ({ size = 'md', fullscreen = false, message }: LoadingProps) => {
  const spinner = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <CircularProgress size={sizeMap[size]} />
      {message && <Typography variant="body2" color="text.secondary">{message}</Typography>}
    </Box>
  )

  if (fullscreen) {
    return (
      <Box sx={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {spinner}
      </Box>
    )
  }

  return spinner
}

export default Loading
