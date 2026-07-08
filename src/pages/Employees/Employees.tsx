import { useEffect, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { api } from '../../lib/api'


export default function Employees() {
  const [employees, setEmployees] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '' })

  const load = async () => {
    const res = await api.get('/employees')
    setEmployees(res.data)
  }

  useEffect(() => { load() }, [])

  const handleSave = async () => {
    try {
      await api.post('/employees', { name: form.name, phone: form.phone })
      setShowForm(false)
      setForm({ name: '', phone: '' })
      load()
    } catch (error) {
      alert('Çalışan eklenirken hata oluştu')
    }
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      RECEIVED: 'bg-blue-100 text-blue-700',
      CUTTING: 'bg-yellow-100 text-yellow-700',
      SEWING: 'bg-orange-100 text-orange-700',
      FITTING: 'bg-brand-100 text-brand-800',
      DELIVERED: 'bg-green-100 text-green-700',
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const getStatusLabel = (status: string) => {
    const labels: any = {
      RECEIVED: 'Alındı', CUTTING: 'Kesim', SEWING: 'Dikim',
      FITTING: 'Prova', DELIVERED: 'Teslim Edildi'
    }
    return labels[status] || status
  }

  return (
    <div className="p-8 md:p-14 mt-12 md:mt-0">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Çalışan Yönetimi</h1>
          <p className="text-gray-500 text-sm mt-1.5">{employees.length} çalışan</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white px-4 md:px-5 py-2.5 md:py-3 rounded-xl text-sm font-medium transition-all">
          <Plus size={18} /> <span className="hidden md:inline">Yeni Çalışan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {employees.map(emp => (
          <div key={emp.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-brand-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {emp.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{emp.name}</h3>
                <p className="text-sm text-gray-500">{emp.phone || 'Telefon yok'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xs bg-brand-100 text-brand-800 px-2.5 py-1.5 rounded-full font-medium">
                {emp.orders?.length || 0} Aktif Sipariş
              </span>
            </div>
            <div className="space-y-2.5">
              {emp.orders?.map((order: any) => (
                <div key={order.id} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-brand-700 font-medium">#{order.id}</p>
                      <p className="text-sm font-medium text-gray-900">{order.customer?.name}</p>
                      <p className="text-xs text-gray-500">{order.description}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </div>
              ))}
              {(!emp.orders || emp.orders.length === 0) && (
                <p className="text-sm text-gray-400 text-center py-2">Aktif sipariş yok</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-7 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Yeni Çalışan</h2>
              <button onClick={() => setShowForm(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Ad Soyad</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
                  placeholder="Ad Soyad" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Telefon</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
                  placeholder="05XX XXX XX XX" />
              </div>
            </div>
            <button onClick={handleSave} className="w-full mt-6 bg-brand-700 hover:bg-brand-800 text-white font-medium py-2.5 rounded-xl transition-all">
              Kaydet
            </button>
          </div>
        </div>
      )}
    </div>
  )
}