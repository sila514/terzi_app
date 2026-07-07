import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Scissors } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      if (isRegister) {
        await axios.post('http://localhost:3000/api/auth/register', { name, email, password, role: 'ADMIN' })
        const res = await axios.post('http://localhost:3000/api/auth/login', { email, password })
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        navigate('/')
      } else {
        const res = await axios.post('http://localhost:3000/api/auth/login', { email, password })
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        navigate('/')
      }
    } catch (err: any) {
      setError(isRegister ? 'Kayıt başarısız. Email zaten kayıtlı olabilir.' : 'Email veya şifre hatalı')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-purple-900 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
            <Scissors size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">TerziPro</h1>
            <p className="text-sm text-gray-500">Atölye Yönetim Sistemi</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {isRegister ? 'Kayıt Ol' : 'Giriş Yap'}
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
        )}

        <div className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ad Soyad"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="ornek@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="••••••••"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Bekleyin...' : isRegister ? 'Kayıt Ol' : 'Giriş Yap'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          {isRegister ? 'Zaten hesabın var mı?' : 'Hesabın yok mu?'}
          <button
            onClick={() => { setIsRegister(!isRegister); setError('') }}
            className="text-purple-600 font-medium ml-1 hover:underline"
          >
            {isRegister ? 'Giriş Yap' : 'Kayıt Ol'}
          </button>
        </p>
      </div>
    </div>
  )
}