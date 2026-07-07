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
    <div className="min-h-screen bg-plum-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Başlık */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-plum-500 to-plum-700 rounded-2xl flex items-center justify-center shadow-lg shadow-black/30 mb-5">
            <Scissors size={34} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-semibold text-white">TerziPro</h1>
          <p className="text-plum-300 text-sm mt-1.5">Atölye Yönetim Sistemi</p>
        </div>

        {/* Kart */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Sekmeler */}
          <div className="flex p-2.5 gap-2">
            <button
              onClick={() => { setIsRegister(false); setError('') }}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                !isRegister ? 'bg-ink-100 text-ink-900' : 'text-ink-400 hover:text-ink-600'
              }`}
            >
              Giriş Yap
            </button>
            <button
              onClick={() => { setIsRegister(true); setError('') }}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                isRegister ? 'bg-ink-100 text-ink-900' : 'text-ink-400 hover:text-ink-600'
              }`}
            >
              Kayıt Ol
            </button>
          </div>

          <div className="px-8 pb-8 pt-3">
            {error && (
              <div className="bg-rose-50 text-rose-600 p-3 rounded-xl mb-4 text-sm">{error}</div>
            )}

            <div className="space-y-5">
              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wide mb-2">Ad Soyad</label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full border border-ink-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-plum-500"
                    placeholder="Ad Soyad"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wide mb-2">E-Posta</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full border border-ink-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-plum-500"
                  placeholder="ornek@email.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wide mb-2">Şifre</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  className="w-full border border-ink-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-plum-500"
                  placeholder="••••••••"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-plum-600 to-plum-700 hover:from-plum-700 hover:to-plum-800 text-white font-semibold py-4 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-plum-900/20 mt-3 text-base"
              >
                {loading ? 'Bekleyin...' : isRegister ? 'Kayıt Ol' : 'Giriş Yap'}
              </button>
            </div>
          </div>
        </div>

        <div className="stitch-gold w-24 mx-auto mt-10 opacity-70" />
        <p className="text-center text-plum-300/70 text-xs mt-4">
          TerziPro v1.0 · Tüm hakları saklıdır
        </p>
      </div>
    </div>
  )
}
