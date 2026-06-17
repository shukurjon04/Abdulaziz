import { useState, useEffect } from 'react'
import './screens.css'

export default function TicketsScreen({ user, setScreen, setActiveTicket, T }) {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading tickets
    setTimeout(() => {
      const mockTickets = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        number: i + 1,
        isPro: i > 60,
        questionCount: 20,
      }))
      setTickets(mockTickets)
      setLoading(false)
    }, 500)
  }, [])

  const handleSelectTicket = (ticket) => {
    setActiveTicket(ticket)
    setScreen('ticket-quiz')
  }

  return (
    <div className="screen">
      <h1 className="screen-title">🎫 Biletlar</h1>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <p style={{ marginBottom: '20px', color: 'var(--gray-500)' }}>
            {tickets.length} ta bilet mavjud • Har biri 20 ta savol
          </p>

          <div className="tickets-grid">
            {tickets.map(ticket => (
              <div
                key={ticket.id}
                className={`ticket-item ${ticket.isPro ? 'pro' : ''}`}
                onClick={() => handleSelectTicket(ticket)}
              >
                <div className="ticket-number">{ticket.number}</div>
                <div className="ticket-label">Bilet</div>
                {ticket.isPro && (
                  <div style={{ fontSize: '12px', marginTop: '8px', color: 'var(--warning)' }}>
                    PRO
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
