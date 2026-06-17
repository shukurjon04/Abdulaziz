import './toast.css'

export default function Toast({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  )
}
