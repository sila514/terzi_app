import axios from 'axios'

// Canlıda Vercel'de tanımlanan VITE_API_URL ortam değişkenini kullanır.
// Yerelde çalışırken (npm run dev) tanımlı değilse localhost:3000'e düşer.
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const api = axios.create({ baseURL })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
