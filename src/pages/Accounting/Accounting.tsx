import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, AlertCircle, Plus, X } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { api } from '../../lib/api'


export default function Accounting() {
  const [summary, setSummary] = useState<any>(null)
  const [monthly, setMonthly] = useState<any[]>([])
  const [expenses, setExpenses] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [activeTab, setActiveTab] = useState('unpaid')
  const [form, setForm] = useState({ category: 'OTHER', amount: '', description: '', expenseDate: '' })

  const loadAll = () => {
    api.get('/reports/summary').then(r => setSummary(r.data)).catch(console.error)
    api.get('/reports/monthly?year=2026').then(r => setMonthly(r.data)).catch(console.error)
    api.get('/expenses').then(r => setExpenses(r.data)).catch(console.error)
  }

  useEffect(() => { loadAll() }, [])

  const handleSaveExpense = async () => {
    try {
      if (!form.amount || !form.expenseDate) {
        alert('Tutar ve tarih zorunlu!')
        return
      }
      await api.post('/expenses', {
        category: form.category,
        amount: Number(form.amount),
        description: form.description || null,
        expenseDate: new Date(form.expenseDate).toISOString()
      })
      setShowForm(false)
      setForm({ category: 'OTHER', amount: '', description: '', expenseDate: '' })
      loadAll()
    } catch (error: any) {
      alert('Hata: ' + (error.response?.data?.detail || error.message))
    }
  }

  const tabs = [
    { key: 'unpaid', label: 'Ödenmemişler' },
    { key: 'monthly', label: 'Bu Ayın Cirosu' },
    { key: 'expenses', label: 'Giderler' },
  ]

  return (
    <div className="p-8 md:p-14 mt-12 md:mt-0">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink-900">Muhasebe & Raporlama</h1>
          <p className="text-ink-500 text-sm mt-1.5">Finansal Özet</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-plum-600 hover:bg-plum-700 text-white px-4 md:px-5 py-2.5 md:py-3 rounded-xl text-sm font-medium">
          <Plus size={18} /> <span className="hidden md:inline">Gider Ekle</span>
        </button>
      </div>
      <div className="stitch mb-7" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-9 md:mb-12">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-ink-100">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={18} className="text-green-500" />
            <p className="text-sm text-ink-500">Toplam Gelir</p>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-green-600">{summary?.totalRevenue?.toLocaleString('tr-TR') || 0} ₺</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-ink-100">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown size={18} className="text-red-500" />
            <p className="text-sm text-ink-500">Toplam Gider</p>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-red-600">{summary?.totalExpenses?.toLocaleString('tr-TR') || 0} ₺</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-ink-100">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={18} className="text-yellow-500" />
            <p className="text-sm text-ink-500">Bekleyen Borç</p>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-yellow-600">{summary?.totalUnpaid?.toLocaleString('tr-TR') || 0} ₺</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-ink-100 mb-9 md:mb-12">
        <h2 className="font-semibold text-ink-900 mb-5">Gelir & Gider Grafiği</h2>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={monthly}>
            <defs>
              <linearGradient id="gelir" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5B2A86" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#5B2A86" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gider" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip formatter={(val: any) => `${val?.toLocaleString('tr-TR')} ₺`} />
            <Area type="monotone" dataKey="revenue" stroke="#5B2A86" fill="url(#gelir)" strokeWidth={2} name="Gelir" />
            <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="url(#gider)" strokeWidth={2} name="Gider" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-ink-100">
        <div className="flex border-b border-ink-100 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`px-5 md:px-7 py-5 text-sm font-medium transition-all whitespace-nowrap ${activeTab === t.key ? 'border-b-2 border-plum-600 text-plum-600' : 'text-ink-500 hover:text-ink-700'}`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-6 md:p-8">
          {activeTab === 'unpaid' && (
            <div className="space-y-3">
              {!summary?.unpaidOrders?.length ? (
                <p className="text-ink-400 text-sm text-center py-4">Ödenmemiş sipariş yok 🎉</p>
              ) : (
                summary.unpaidOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-5 bg-yellow-50 rounded-xl">
                    <div>
                      <p className="font-medium text-ink-900 text-sm">{order.customer?.name}</p>
                      <p className="text-xs text-ink-500">{order.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600 text-sm">{(order.price - order.depositPaid)?.toLocaleString('tr-TR')} ₺</p>
                      <p className="text-xs text-ink-400">Kalan borç</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'monthly' && (
            <div className="text-center py-4">
              <p className="text-3xl font-bold text-plum-600 mb-1">{summary?.monthlyRevenue?.toLocaleString('tr-TR') || 0} ₺</p>
              <p className="text-sm text-ink-500">Bu ay tahsil edilen toplam tutar</p>
            </div>
          )}

          {activeTab === 'expenses' && (
            <div className="space-y-3">
              {!expenses.length ? (
                <p className="text-ink-400 text-sm text-center py-4">Henüz gider kaydı yok</p>
              ) : (
                expenses.map((exp: any) => (
                  <div key={exp.id} className="flex items-center justify-between p-5 bg-ink-50 rounded-xl">
                    <div>
                      <p className="font-medium text-ink-900 text-sm">{exp.description || exp.category}</p>
                      <p className="text-xs text-ink-500">{new Date(exp.expenseDate).toLocaleDateString('tr-TR')}</p>
                    </div>
                    <p className="font-semibold text-red-600 text-sm">-{exp.amount?.toLocaleString('tr-TR')} ₺</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-7 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-ink-900">Yeni Gider</h2>
              <button onClick={() => setShowForm(false)}><X size={20} className="text-ink-400" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink-600 mb-1">Kategori</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plum-500">
                  <option value="RENT">Kira</option>
                  <option value="FABRIC">Kumaş</option>
                  <option value="LABOR">İşçilik</option>
                  <option value="UTILITY">Fatura</option>
                  <option value="OTHER">Diğer</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-ink-600 mb-1">Tutar (₺)</label>
                <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                  className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plum-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink-600 mb-1">Açıklama</label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plum-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink-600 mb-1">Tarih</label>
                <input type="date" value={form.expenseDate} onChange={e => setForm({ ...form, expenseDate: e.target.value })}
                  className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plum-500" />
              </div>
            </div>
            <button onClick={handleSaveExpense} className="w-full mt-6 bg-plum-600 hover:bg-plum-700 text-white font-medium py-2.5 rounded-xl transition-all">
              Kaydet
            </button>
          </div>
        </div>
      )}
    </div>
  )
}