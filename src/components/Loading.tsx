import './Loading.css'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  fullscreen?: boolean
  message?: string
}

const Loading = ({ size = 'md', fullscreen = false, message }: LoadingProps) => {
  const content = (
    <div className={`loading loading-${size}`}>
      <div className="loading-spinner" />
      {message && <p className="loading-message">{message}</p>}
    </div>
  )

  if (fullscreen) {
    return <div className="loading-fullscreen">{content}</div>
  }

  return content
}

export default Loading
