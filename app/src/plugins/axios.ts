import axios from 'axios'

const ACCESS_KEY = 'medicare_access'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status
    if (status === 401) {
      localStorage.removeItem(ACCESS_KEY)
      localStorage.removeItem('medicare_refresh')
      window.location.href = '/login'
    }
    const message = err.response?.data?.detail || err.message || 'Error de red'
    return Promise.reject(new Error(message))
  },
)

export { instance }
