import { useState, useEffect } from 'react'
import api, { setToken } from './api'
import './styles/app.css'

// Screens
import LoginScreen from './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen'
import TicketsScreen from './screens/TicketsScreen'
import TicketQuizScreen from './screens/TicketQuizScreen'
import TestsScreen from './screens/TestsScreen'
import ExamScreen from './screens/ExamScreen'
import StatsScreen from './screens/StatsScreen'
import AdminScreen from './screens/AdminScreen'
import ProfileScreen from './screens/ProfileScreen'

// Components
import Navbar from './components/Navbar'
import Toast from './components/Toast'

const TRANSLATIONS = {
  uz: {
    home: 'Bosh sahifa',
    tickets: 'Biletlar',
    tests: 'Testlar',
    exam: 'Imtihon',
    stats: 'Statistika',
    profile: 'Profil',
    admin: 'Admin',
  },
  ru: {
    home: 'Главная',
    tickets: 'Билеты',
    tests: 'Тесты',
    exam: 'Экзамен',
    stats: 'Статистика',
    profile: 'Профиль',
    admin: 'Администратор',
  },
  en: {
    home: 'Home',
    tickets: 'Tickets',
    tests: 'Tests',
    exam: 'Exam',
    stats: 'Statistics',
    profile: 'Profile',
    admin: 'Admin',
  },
}

export default function App() {
  const [screen, setScreen] = useState('home')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dark, setDark] = useState(localStorage.getItem('theme') === 'dark')
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'uz')
  const [toasts, setToasts] = useState([])
  const [activeTicket, setActiveTicket] = useState(null)

  const T = TRANSLATIONS[lang] || TRANSLATIONS.uz

  // Check if logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          setToken(token)
          const res = await api.get('/auth/me')
          setUser(res.data)
          setScreen('home')
        } catch (err) {
          console.error('Auth error:', err)
          setToken(null)
        }
      }
      setLoading(false)
    }
    checkAuth()
  }, [])

  useEffect(() => {
    localStorage.setItem('theme', dark ? 'dark' : 'light')
    document.body.classList.toggle('dark-mode', dark)
  }, [dark])

  useEffect(() => {
    localStorage.setItem('lang', lang)
  }, [lang])

  const addToast = (message, type = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }

  const handleLogout = () => {
    setToken(null)
    setUser(null)
    setScreen('login')
    addToast('Siz chiqtingiz', 'info')
  }

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Yuklanmoqda...</p>
      </div>
    )
  }

  if (!user) {
    return <LoginScreen onLogin={setUser} addToast={addToast} lang={lang} setLang={setLang} />
  }

  const renderScreen = () => {
    const props = { user, setUser, addToast, lang, T, dark, setDark }

    switch (screen) {
      case 'home':
        return <HomeScreen {...props} setScreen={setScreen} />
      case 'tickets':
        return <TicketsScreen {...props} setScreen={setScreen} setActiveTicket={setActiveTicket} />
      case 'ticket-quiz':
        return <TicketQuizScreen {...props} setScreen={setScreen} ticket={activeTicket} />
      case 'tests':
        return <TestsScreen {...props} setScreen={setScreen} />
      case 'exam':
        return <ExamScreen {...props} setScreen={setScreen} />
      case 'stats':
        return <StatsScreen {...props} />
      case 'admin':
        return user.isAdmin ? <AdminScreen {...props} setScreen={setScreen} /> : <HomeScreen {...props} setScreen={setScreen} />
      case 'profile':
        return <ProfileScreen {...props} onLogout={handleLogout} />
      default:
        return <HomeScreen {...props} setScreen={setScreen} />
    }
  }

  return (
    <div className="app-container">
      <Navbar
        user={user}
        screen={screen}
        setScreen={setScreen}
        dark={dark}
        setDark={setDark}
        lang={lang}
        setLang={setLang}
        T={T}
      />
      <main className="app-main">
        {renderScreen()}
      </main>
      <Toast toasts={toasts} />
    </div>
  )
}
