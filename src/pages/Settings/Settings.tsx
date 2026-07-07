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
    <div className="p-6 md:p-10 mt-12 md:mt-0">
      <div className="mb-6 md:mb-7">
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink-900">Genel Ayarlar</h1>
        <p className="text-ink-500 text-sm mt-1.5">İşletme bilgileri ve hesap ayarları</p>
      </div>
      <div className="stitch mb-8 md:mb-10" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-7 items-start">
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-ink-100">
          <h2 className="font-semibold text-ink-900 mb-5">Profil Bilgileri</h2>
          <div className="flex items-center gap-4 mb-7">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-plum-600 rounded-full flex items-center justify-center text-white text-xl md:text-2xl font-bold">
              {form.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-ink-900">{form.name}</p>
              <p className="text-sm text-ink-500">{form.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[['name', 'Ad Soyad'], ['email', 'Email']].map(([key, label]) => (
              <div key={key}>
                <label className="block text-xs font-medium text-ink-600 mb-1.5">{label}</label>
                <input value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                  className="w-full border border-ink-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-plum-500" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-ink-100">
          <h2 className="font-semibold text-ink-900 mb-5">İşletme Bilgileri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[['businessName', 'İşletme Adı'], ['address', 'Adres'], ['phone', 'Telefon'], ['whatsapp', 'WhatsApp']].map(([key, label]) => (
              <div key={key}>
                <label className="block text-xs font-medium text-ink-600 mb-1.5">{label}</label>
                <input value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                  className="w-full border border-ink-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-plum-500" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <button onClick={handleSave}
        className="w-full lg:w-auto lg:px-10 mt-6 bg-plum-600 hover:bg-plum-700 text-white font-medium py-3 rounded-xl transition-all">
        {saved ? '✓ Kaydedildi!' : 'Değişiklikleri Kaydet'}
      </button>
    </div>
  )
}