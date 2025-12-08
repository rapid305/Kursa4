import './Alert.css'

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
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }

  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-icon">{icons[type]}</div>
      <div className="alert-content">
        {title && <h4 className="alert-title">{title}</h4>}
        <p className="alert-message">{message}</p>
      </div>
      {closable && onClose && (
        <button className="alert-close" onClick={onClose} aria-label="Close alert">
          ✕
        </button>
      )}
    </div>
  )
}

export default Alert


