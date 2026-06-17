import './screens.css'

export default function HomeScreen({ user, setScreen, T }) {
  const stats = {
    totalQuestions: 2000,
    correctAnswers: 1456,
    testsPassed: 12,
    accuracy: 73,
  }

  return (
    <div className="screen">
      <h1 className="screen-title">👋 Assalomu alaykum, {user?.firstName}!</h1>

      <div className="home-welcome">
        <div className="welcome-card">
          <h2>Salomat!</h2>
          <p>Yo'l qoidalari va savol-javoblar uchun moslashtirilgan sinov platformasiga xush kelibsiz.</p>
          <button className="btn btn-primary" onClick={() => setScreen('tickets')}>
            Biletlarni o'qish →
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <div className="stat-label">Jami savollar</div>
            <div className="stat-value">{stats.totalQuestions}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <div className="stat-label">To'g'ri javoblar</div>
            <div className="stat-value">{stats.correctAnswers}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-info">
            <div className="stat-label">O'tgan testlar</div>
            <div className="stat-value">{stats.testsPassed}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <div className="stat-label">Aniqlik</div>
            <div className="stat-value">{stats.accuracy}%</div>
          </div>
        </div>
      </div>

      <h2 className="section-title">Tez kirish</h2>

      <div className="quick-access">
        <div className="access-card" onClick={() => setScreen('tickets')}>
          <div className="access-icon">🎫</div>
          <h3>Biletlar</h3>
          <p>100 ta bilet, 20 ta savol</p>
        </div>

        <div className="access-card" onClick={() => setScreen('tests')}>
          <div className="access-icon">✍️</div>
          <h3>Testlar</h3>
          <p>Cheksiz savol-javoblar</p>
        </div>

        <div className="access-card" onClick={() => setScreen('exam')}>
          <div className="access-icon">📝</div>
          <h3>Rasmiy Imtihon</h3>
          <p>20 ta savol, 20 daqiqa</p>
        </div>

        <div className="access-card" onClick={() => setScreen('stats')}>
          <div className="access-icon">📊</div>
          <h3>Statistika</h3>
          <p>Natijalaringizni ko'ring</p>
        </div>
      </div>

      <div className="tips-section">
        <h2 className="section-title">💡 Maslahatlar</h2>
        <div className="tips-list">
          <div className="tip-item">
            <span className="tip-number">1</span>
            <div>
              <h4>Muntazam mashq qiling</h4>
              <p>Kuniga 30-60 daqiqa vaqt ajratib test yechishni boshlang</p>
            </div>
          </div>
          <div className="tip-item">
            <span className="tip-number">2</span>
            <div>
              <h4>Izohlarga qarang</h4>
              <p>Har bir savolning izohlari o'qib, xatolaringizni tushuning</p>
            </div>
          </div>
          <div className="tip-item">
            <span className="tip-number">3</span>
            <div>
              <h4>Statistika bilang</h4>
              <p>Qaysi mavzularda zaif ekanligingizni aniqlang va mashq qiling</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
