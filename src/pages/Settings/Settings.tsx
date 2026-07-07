import { useState } from 'react'

export default function Settings() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    businessName: 'Terzi Atölyesi',
    address: '',
    phone: '',
    whatsapp: '',
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-4 md:p-8 mt-12 md:mt-0 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Genel Ayarlar</h1>
        <p className="text-gray-500 text-sm mt-1">İşletme bilgileri ve hesap ayarları</p>
      </div>

      <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="font-semibold text-gray-800 mb-4">Profil Bilgileri</h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-xl md:text-2xl font-bold">
            {form.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-gray-800">{form.name}</p>
            <p className="text-sm text-gray-500">{form.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[['name', 'Ad Soyad'], ['email', 'Email']].map(([key, label]) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <input value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="font-semibold text-gray-800 mb-4">İşletme Bilgileri</h2>
        <div className="space-y-4">
          {[['businessName', 'İşletme Adı'], ['address', 'Adres'], ['phone', 'Telefon'], ['whatsapp', 'WhatsApp']].map(([key, label]) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <input value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleSave}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-xl transition-all">
        {saved ? '✓ Kaydedildi!' : 'Değişiklikleri Kaydet'}
      </button>
    </div>
  )
}