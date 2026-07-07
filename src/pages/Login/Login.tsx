import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Scissors, Ruler, Shirt, Wallet } from 'lucide-react'

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

  const features = [
    { icon: Ruler, text: 'Müşteri ölçü kartları tek yerde' },
    { icon: Shirt, text: 'Sipariş ve teslim takibi' },
    { icon: Wallet, text: 'Gelir, gider ve muhasebe raporu' },
  ]

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sol Panel - Marka Tanıtımı */}
      <div className="relative lg:w-1/2 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950 text-white flex flex-col justify-center px-8 sm:px-14 lg:px-20 py-16 lg:py-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-16 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-md mx-auto lg:mx-0">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center border border-white/20">
              <Scissors size={24} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-xl">TerziPro</p>
              <p className="text-sm text-purple-300">Atölye Yönetim Sistemi</p>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-5">
            Atölyeni tek ekrandan yönet.
          </h1>
          <p className="text-purple-200 text-base sm:text-lg mb-12 leading-relaxed">
            Müşteriler, siparişler, çalışanlar ve muhasebe — hepsi TerziPro'da bir arada.
            Kağıt defterlere veda et.
          </p>

          <div className="space-y-5">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-4">
                <div className="w-10 h-10 shrink-0 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                  <Icon size={18} className="text-purple-200" />
                </div>
                <p className="text-purple-100 text-sm sm:text-base">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sağ Panel - Form */}
      <div className="lg:w-1/2 bg-gray-50 flex items-center justify-center px-6 sm:px-12 py-16">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
              <Scissors size={20} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-800">TerziPro</p>
              <p className="text-xs text-gray-500">Atölye Yönetim Sistemi</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-100">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              {isRegister ? 'Kayıt Ol' : 'Giriş Yap'}
            </h2>
            <p className="text-gray-500 mb-8">
              {isRegister ? 'Atölyen için yeni bir hesap oluştur' : 'Hesabına giriş yaparak devam et'}
            </p>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm">{error}</div>
            )}

            <div className="space-y-5">
              {isRegister && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Ad Soyad</label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Ad Soyad"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="ornek@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Şifre</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="••••••••"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3.5 rounded-xl transition-all disabled:opacity-50 text-base"
              >
                {loading ? 'Bekleyin...' : isRegister ? 'Kayıt Ol' : 'Giriş Yap'}
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-8">
              {isRegister ? 'Zaten hesabın var mı?' : 'Hesabın yok mu?'}
              <button
                onClick={() => { setIsRegister(!isRegister); setError('') }}
                className="text-purple-600 font-medium ml-1.5 hover:underline"
              >
                {isRegister ? 'Giriş Yap' : 'Kayıt Ol'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
