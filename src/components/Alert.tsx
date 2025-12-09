import { Alert as MUIAlert, AlertTitle } from '@mui/material'

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  onClose?: () => void
  closable?: boolean
}

const Alert = ({
  type = 'info',
  title,
  message,
  onClose,
  closable = true
}: AlertProps) => {
  return (
    <MUIAlert
      severity={type}
      onClose={closable ? onClose : undefined}
      sx={{ borderRadius: 2 }}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {message}
    </MUIAlert>
  )
}

export default Alert
