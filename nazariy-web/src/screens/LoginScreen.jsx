import { useState } from 'react'
import api, { setToken } from '../api'
import './login.css'

export default function LoginScreen({ onLogin, addToast, lang, setLang }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true)

  const translations = {
    uz: {
      welcome: "Nazariy Avtotestga xush kelibsiz",
      email: "Email",
      password: "Parol",
      login: "Kirish",
      register: "Ro'yxatdan o'tish",
      noAccount: "Hisobingiz yo'qmi?",
      haveAccount: "Hisobingiz bormi?",
      switchToRegister: "Ro'yxatdan o'ting",
      switchToLogin: "Kirishni boshlang",
      or: "yoki",
      guestLogin: "Mehmon sifatida kirish",
    },
    ru: {
      welcome: "Добро пожаловать в Nazariy Avtotest",
      email: "Email",
      password: "Пароль",
      login: "Вход",
      register: "Регистрация",
      noAccount: "Нет аккаунта?",
      haveAccount: "Есть аккаунт?",
      switchToRegister: "Зарегистрируйтесь",
      switchToLogin: "Войти",
      or: "или",
      guestLogin: "Войти как гость",
    },
    en: {
      welcome: "Welcome to Nazariy Avtotest",
      email: "Email",
      password: "Password",
      login: "Login",
      register: "Register",
      noAccount: "Don't have an account?",
      haveAccount: "Have an account?",
      switchToRegister: "Sign up",
      switchToLogin: "Log in",
      or: "or",
      guestLogin: "Login as guest",
    },
  }

  const T = translations[lang] || translations.uz

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      addToast('Email va parol kiritilishi shart', 'error')
      return
    }

    setLoading(true)
    try {
      // Demo login - in production, use actual backend authentication
      const userData = {
        id: 'user_' + Date.now(),
        tgId: '123456789',
        firstName: email.split('@')[0],
        email,
        isPro: false,
        isAdmin: false,
        adminRole: null,
      }

      // Create a simple token for demo
      const token = btoa(JSON.stringify(userData))
      setToken(token)
      localStorage.setItem('user', JSON.stringify(userData))

      onLogin(userData)
      addToast('Muvaffaqiyatli kirdingiz!', 'success')
    } catch (err) {
      addToast('Login xatosi: ' + err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleGuestLogin = () => {
    const userData = {
      id: 'guest_' + Date.now(),
      tgId: 'guest',
      firstName: 'Mehmon',
      email: 'guest@nazariy.local',
      isPro: false,
      isAdmin: false,
      adminRole: null,
    }

    const token = btoa(JSON.stringify(userData))
    setToken(token)
    localStorage.setItem('user', JSON.stringify(userData))

    onLogin(userData)
    addToast('Mehmon sifatida kirdingiz', 'success')
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>📚 Nazariy</h1>
          <p>{T.welcome}</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label className="form-label">{T.email}</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{T.password}</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={loading}
          >
            {loading ? 'Yuklanmoqda...' : T.login}
          </button>
        </form>

        <div className="login-divider">
          <span>{T.or}</span>
        </div>

        <button
          onClick={handleGuestLogin}
          className="btn btn-outline btn-block"
        >
          {T.guestLogin}
        </button>

        <div className="login-footer">
          {isLogin ? (
            <>
              <span>{T.noAccount}</span>
              <button
                type="button"
                className="link-btn"
                onClick={() => setIsLogin(false)}
              >
                {T.switchToRegister}
              </button>
            </>
          ) : (
            <>
              <span>{T.haveAccount}</span>
              <button
                type="button"
                className="link-btn"
                onClick={() => setIsLogin(true)}
              >
                {T.switchToLogin}
              </button>
            </>
          )}
        </div>

        <div className="login-lang">
          <select value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="uz">O'zbekcha</option>
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      <div className="login-background"></div>
    </div>
  )
}
