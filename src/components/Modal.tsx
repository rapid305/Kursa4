import { ReactNode } from 'react'
import { Dialog, DialogTitle, DialogContent, IconButton, Stack } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
  closeButton?: boolean
}

const widthMap = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
} as const

const Modal = ({ isOpen, onClose, title, children, size = 'md', closeButton = true }: ModalProps) => {
  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth={widthMap[size]}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 3, pt: 2 }}>
        <DialogTitle sx={{ p: 0, fontWeight: 800 }}>{title}</DialogTitle>
        {closeButton && (
          <IconButton aria-label="Close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        )}
      </Stack>
      <DialogContent sx={{ pt: 2 }}>{children}</DialogContent>
    </Dialog>
  )
}

export default Modal

