import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Scissors, AlertCircle } from 'lucide-react'
import { api } from '../../lib/api'

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
        await api.post('/auth/register', { name, email, password, role: 'ADMIN' })
        const res = await api.post('/auth/login', { email, password })
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        navigate('/')
      } else {
        const res = await api.post('/auth/login', { email, password })
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
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#141B34] via-[#1E2148] to-[#20254E] px-4 py-12">
      {/* Radial glow efektleri */}
      <div className="pointer-events-none absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[#4F6BFF]/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#5B5FF7]/10 blur-[120px]" />

      <div className="relative w-[92%] sm:w-full sm:max-w-[540px] flex flex-col items-center">
        {/* Logo & Başlık */}
        <div className="flex flex-col items-center mb-11 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#5B5FF7] to-[#2E63E9] flex items-center justify-center shadow-lg shadow-[#2E63E9]/30 mb-6">
            <Scissors size={32} className="text-white" />
          </div>
          <h1 className="text-[36px] leading-tight font-bold text-white tracking-tight">TerziPro</h1>
          <p className="text-gray-400 text-base mt-2">Atölye Yönetim Sistemi</p>
        </div>

        {/* Kart */}
        <div className="w-full bg-white rounded-[24px] shadow-[0_25px_70px_-20px_rgba(0,0,0,0.45)] border border-[#E5E7EB] p-8 sm:p-12">
          {/* Sekmeler */}
          <div className="flex bg-gray-100 rounded-2xl p-2 gap-2 mb-8">
            <button
              onClick={() => { setIsRegister(false); setError('') }}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                !isRegister ? 'bg-white text-[#1F2937] shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Giriş Yap
            </button>
            <button
              onClick={() => { setIsRegister(true); setError('') }}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isRegister ? 'bg-white text-[#1F2937] shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Kayıt Ol
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
              <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-600 text-sm leading-snug">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {isRegister && (
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Ad Soyad</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full h-[56px] rounded-[14px] border border-[#E5E7EB] px-4 text-sm text-[#1F2937] placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-[#4F6BFF] focus:ring-4 focus:ring-[#4F6BFF]/10"
                  placeholder="Ad Soyad"
                />
              </div>
            )}
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2.5">E-Posta</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full h-[56px] rounded-[14px] border border-[#E5E7EB] px-4 text-sm text-[#1F2937] placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-[#4F6BFF] focus:ring-4 focus:ring-[#4F6BFF]/10"
                placeholder="ornek@email.com"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Şifre</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                className="w-full h-[56px] rounded-[14px] border border-[#E5E7EB] px-4 text-sm text-[#1F2937] placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-[#4F6BFF] focus:ring-4 focus:ring-[#4F6BFF]/10"
                placeholder="••••••••"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full h-[58px] rounded-[14px] bg-gradient-to-r from-[#5B5FF7] to-[#2E63E9] text-white font-bold text-[15px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#2E63E9]/30 disabled:opacity-50 disabled:hover:translate-y-0 mt-2"
            >
              {loading ? 'Bekleyin...' : isRegister ? 'Kayıt Ol' : 'Giriş Yap'}
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-7">
            {isRegister ? 'Zaten hesabın var mı?' : 'Hesabın yok mu?'}
            <button
              onClick={() => { setIsRegister(!isRegister); setError('') }}
              className="text-[#4F6BFF] font-semibold ml-1.5 hover:underline transition-all duration-200"
            >
              {isRegister ? 'Giriş Yap' : 'Kayıt Ol'}
            </button>
          </p>
        </div>

        <p className="text-center text-gray-500 text-xs mt-8">
          TerziPro v1.0 · Tüm hakları saklıdır
        </p>
      </div>
    </div>
  )
}
