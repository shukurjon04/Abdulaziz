import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token management
export const setToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    localStorage.setItem('token', token)
  } else {
    delete api.defaults.headers.common['Authorization']
    localStorage.removeItem('token')
  }
}

// Load token from localStorage on app start
const savedToken = localStorage.getItem('token')
if (savedToken) {
  setToken(savedToken)
}

// Request interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      setToken(null)
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
