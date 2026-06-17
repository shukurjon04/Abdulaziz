import './navbar.css'

export default function Navbar({ user, screen, setScreen, dark, setDark, lang, setLang, T }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>📚 Nazariy</h1>
        </div>

        <div className="navbar-menu">
          <button
            className={`nav-link ${screen === 'home' ? 'active' : ''}`}
            onClick={() => setScreen('home')}
          >
            🏠 {T.home}
          </button>
          <button
            className={`nav-link ${screen === 'tickets' ? 'active' : ''}`}
            onClick={() => setScreen('tickets')}
          >
            🎫 {T.tickets}
          </button>
          <button
            className={`nav-link ${screen === 'tests' ? 'active' : ''}`}
            onClick={() => setScreen('tests')}
          >
            ✍️ {T.tests}
          </button>
          <button
            className={`nav-link ${screen === 'exam' ? 'active' : ''}`}
            onClick={() => setScreen('exam')}
          >
            📝 {T.exam}
          </button>
          <button
            className={`nav-link ${screen === 'stats' ? 'active' : ''}`}
            onClick={() => setScreen('stats')}
          >
            📊 {T.stats}
          </button>
          {user?.isAdmin && (
            <button
              className={`nav-link ${screen === 'admin' ? 'active' : ''}`}
              onClick={() => setScreen('admin')}
            >
              ⚙️ {T.admin}
            </button>
          )}
        </div>

        <div className="navbar-actions">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="lang-select"
          >
            <option value="uz">O'z</option>
            <option value="ru">Ру</option>
            <option value="en">En</option>
          </select>

          <button
            className="theme-toggle"
            onClick={() => setDark(!dark)}
            title={dark ? 'Light mode' : 'Dark mode'}
          >
            {dark ? '☀️' : '🌙'}
          </button>

          <button
            className="nav-link"
            onClick={() => setScreen('profile')}
          >
            👤 {user?.firstName || 'Profile'}
          </button>
        </div>
      </div>
    </nav>
  )
}
