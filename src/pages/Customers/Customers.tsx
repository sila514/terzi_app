import { useEffect, useState } from 'react'
import axios from 'axios'
import { Search, Plus, X, ChevronRight, CreditCard, CheckCircle } from 'lucide-react'

const api = axios.create({ baseURL: 'http://localhost:3000/api' })
api.interceptors.request.use(c => { c.headers.Authorization = `Bearer ${localStorage.getItem('token')}`; return c })

export default function Customers() {
  const [customers, setCustomers] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<any | null>(null)
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [customerForm, setCustomerForm] = useState({ name: '', phone: '', email: '', notes: '', chest: '', waist: '', hip: '', shoulder: '', height: '', armLength: '', legLength: '' })
  const [orderForm, setOrderForm] = useState({ description: '', modelNotes: '', price: '', depositPaid: '', deliveryDate: '', employeeId: '' })

  const load = async () => {
    const res = await api.get(`/customers?search=${search}`)
    setCustomers(res.data)
    const empRes = await api.get('/employees')
    setEmployees(empRes.data)
  }

  const loadCustomer = async (id: number) => {
    const res = await api.get(`/customers/${id}`)
    setSelected(res.data)
  }

  useEffect(() => { load() }, [search])

  const handleSaveCustomer = async () => {
    await api.post('/customers', customerForm)
    setShowCustomerForm(false)
    setCustomerForm({ name: '', phone: '', email: '', notes: '', chest: '', waist: '', hip: '', shoulder: '', height: '', armLength: '', legLength: '' })
    load()
  }

  const handleSaveOrder = async () => {
    try {
      await api.post('/orders', {
        customerId: selected.id,
        employeeId: orderForm.employeeId || null,
        description: orderForm.description,
        modelNotes: orderForm.modelNotes,
        price: Number(orderForm.price),
        depositPaid: Number(orderForm.depositPaid || 0),
        deliveryDate: orderForm.deliveryDate || null,
      })
      setShowOrderForm(false)
      setOrderForm({ description: '', modelNotes: '', price: '', depositPaid: '', deliveryDate: '', employeeId: '' })
      loadCustomer(selected.id)
    } catch (error) {
      alert('Sipariş eklenirken hata oluştu')
    }
  }

  const handlePayment = async () => {
    try {
      if (!paymentAmount || Number(paymentAmount) <= 0) {
        alert('Geçerli bir tutar girin!')
        return
      }
      await api.post('/payments', {
        orderId: selectedOrder.id,
        amount: Number(paymentAmount),
        type: 'BALANCE',
        note: 'Müşteri ödemesi'
      })
      setShowPaymentForm(false)
      setPaymentAmount('')
      setSelectedOrder(null)
      loadCustomer(selected.id)
    } catch (error) {
      alert('Ödeme kaydedilirken hata oluştu')
    }
  }

  const handleDeliver = async (orderId: number) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: 'DELIVERED' })
      loadCustomer(selected.id)
    } catch (error) {
      alert('Durum güncellenirken hata oluştu')
    }
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      RECEIVED: 'bg-blue-100 text-blue-700',
      CUTTING: 'bg-yellow-100 text-yellow-700',
      SEWING: 'bg-orange-100 text-orange-700',
      FITTING: 'bg-plum-100 text-plum-700',
      DELIVERED: 'bg-green-100 text-green-700',
    }
    return colors[status] || 'bg-ink-100 text-ink-700'
  }

  const getStatusLabel = (status: string) => {
    const labels: any = {
      RECEIVED: 'Alındı', CUTTING: 'Kesim', SEWING: 'Dikim',
      FITTING: 'Prova', DELIVERED: 'Teslim Edildi'
    }
    return labels[status] || status
  }

  return (
    <div className="p-6 md:p-10 mt-12 md:mt-0">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink-900">Müşteri & Sipariş Takibi</h1>
          <p className="text-ink-500 text-sm mt-1.5">{customers.length} kayıtlı müşteri</p>
        </div>
        <button onClick={() => setShowCustomerForm(true)} className="flex items-center gap-2 bg-plum-600 hover:bg-plum-700 text-white px-4 md:px-5 py-2.5 md:py-3 rounded-xl text-sm font-medium transition-all">
          <Plus size={18} /> <span className="hidden md:inline">Yeni Müşteri</span>
        </button>
      </div>
      <div className="stitch mb-6" />

      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Müşteri adı veya telefon ara..."
          className="w-full pl-11 pr-4 py-3.5 border border-ink-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-plum-500 bg-white"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-ink-100 overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead className="bg-ink-50 border-b border-ink-100">
            <tr>
              <th className="text-left px-5 md:px-7 py-5 text-xs font-semibold text-ink-500 uppercase">Müşteri</th>
              <th className="text-left px-5 md:px-7 py-5 text-xs font-semibold text-ink-500 uppercase">Telefon</th>
              <th className="text-left px-5 md:px-7 py-5 text-xs font-semibold text-ink-500 uppercase">Sipariş</th>
              <th className="px-5 md:px-7 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {customers.map(c => (
              <tr key={c.id} onClick={() => loadCustomer(c.id)} className="hover:bg-plum-50 cursor-pointer transition-colors">
                <td className="px-5 md:px-7 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 md:w-10 md:h-10 bg-plum-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {c.name.charAt(0)}
                    </div>
                    <span className="font-medium text-ink-900 text-sm md:text-base">{c.name}</span>
                  </div>
                </td>
                <td className="px-5 md:px-7 py-5 text-sm text-ink-600">{c.phone || '-'}</td>
                <td className="px-5 md:px-7 py-5 text-sm text-ink-600">{c.orders?.length || 0}</td>
                <td className="px-5 md:px-7 py-5 text-right"><ChevronRight size={18} className="text-ink-400 ml-auto" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Müşteri Detay */}
      {selected && (
        <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
          <div className="w-full md:w-[600px] bg-white h-full overflow-y-auto shadow-2xl">
            <div className="p-5 md:p-7 border-b border-ink-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 md:w-11 md:h-11 bg-plum-600 rounded-full flex items-center justify-center text-white font-bold">
                  {selected.name.charAt(0)}
                </div>
                <div>
                  <h2 className="font-bold text-ink-900">{selected.name}</h2>
                  <p className="text-sm text-ink-500">{selected.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setShowOrderForm(true)} className="flex items-center gap-1 bg-plum-600 text-white px-3.5 py-2 rounded-lg text-sm font-medium">
                  <Plus size={16} /> Sipariş Ekle
                </button>
                <button onClick={() => setSelected(null)}><X size={20} className="text-ink-400" /></button>
              </div>
            </div>

            <div className="p-5 md:p-7">
              <h3 className="font-semibold text-ink-900 mb-4">Ölçü Kartı</h3>
              <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
                {[['Göğüs', selected.chest], ['Bel', selected.waist], ['Kalça', selected.hip], ['Omuz', selected.shoulder], ['Boy', selected.height], ['Kol Boyu', selected.armLength]].map(([label, val]) => (
                  <div key={label as string} className="bg-ink-50 rounded-xl p-3 md:p-4">
                    <p className="text-xs text-ink-500 mb-1">{label}</p>
                    <p className="font-semibold text-ink-900 text-sm">{val ? `${val} cm` : '-'}</p>
                  </div>
                ))}
              </div>

              <h3 className="font-semibold text-ink-900 mb-4">Siparişler ({selected.orders?.length || 0})</h3>
              <div className="space-y-4">
                {selected.orders?.map((order: any) => {
                  const kalan = order.price - order.depositPaid
                  return (
                    <div key={order.id} className="border border-ink-100 rounded-xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-medium text-ink-900 text-sm">{order.description || 'Sipariş'}</p>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-ink-50 rounded-lg p-3 text-center">
                          <p className="text-xs text-ink-500">Toplam</p>
                          <p className="font-semibold text-xs md:text-sm">{order.price?.toLocaleString('tr-TR')} ₺</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3 text-center">
                          <p className="text-xs text-ink-500">Alınan</p>
                          <p className="font-semibold text-xs md:text-sm text-green-600">{order.depositPaid?.toLocaleString('tr-TR')} ₺</p>
                        </div>
                        <div className={`${kalan > 0 ? 'bg-red-50' : 'bg-green-50'} rounded-lg p-3 text-center`}>
                          <p className="text-xs text-ink-500">Kalan</p>
                          <p className={`font-semibold text-xs md:text-sm ${kalan > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {kalan > 0 ? `${kalan?.toLocaleString('tr-TR')} ₺` : 'Ödendi ✓'}
                          </p>
                        </div>
                      </div>
                      {order.status !== 'DELIVERED' && (
                        <div className="flex gap-2">
                          {kalan > 0 && (
                            <button onClick={() => { setSelectedOrder(order); setShowPaymentForm(true) }}
                              className="flex-1 flex items-center justify-center gap-1 bg-plum-600 hover:bg-plum-700 text-white py-2 rounded-lg text-xs md:text-sm font-medium transition-all">
                              <CreditCard size={14} /> Ödeme Al
                            </button>
                          )}
                          <button onClick={() => handleDeliver(order.id)}
                            className="flex-1 flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-xs md:text-sm font-medium transition-all">
                            <CheckCircle size={14} /> Teslim Et
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
                {(!selected.orders || selected.orders.length === 0) && (
                  <p className="text-ink-400 text-sm text-center py-4">Henüz sipariş yok</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ödeme Formu */}
      {showPaymentForm && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl p-7 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-ink-900">Ödeme Al</h2>
              <button onClick={() => { setShowPaymentForm(false); setPaymentAmount('') }}><X size={20} className="text-ink-400" /></button>
            </div>
            <p className="text-sm text-ink-500 mb-4">
              {selectedOrder.description} — Kalan: <span className="font-semibold text-red-600">{(selectedOrder.price - selectedOrder.depositPaid).toLocaleString('tr-TR')} ₺</span>
            </p>
            <div>
              <label className="block text-xs font-medium text-ink-600 mb-1">Alınan Tutar (₺)</label>
              <input type="number" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)}
                className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plum-500"
                placeholder="0" autoFocus />
            </div>
            <button onClick={handlePayment} className="w-full mt-4 bg-plum-600 hover:bg-plum-700 text-white font-medium py-2.5 rounded-xl transition-all">
              Kaydet
            </button>
          </div>
        </div>
      )}

      {/* Sipariş Formu */}
      {showOrderForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl p-7 w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-ink-900">Yeni Sipariş</h2>
              <button onClick={() => setShowOrderForm(false)}><X size={20} className="text-ink-400" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-ink-600 mb-1">Açıklama</label>
                <input value={orderForm.description} onChange={e => setOrderForm({ ...orderForm, description: e.target.value })}
                  className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plum-500"
                  placeholder="Abiye elbise, takım elbise..." />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-ink-600 mb-1">Model Notları</label>
                <input value={orderForm.modelNotes} onChange={e => setOrderForm({ ...orderForm, modelNotes: e.target.value })}
                  className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plum-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink-600 mb-1">Toplam Fiyat (₺)</label>
                <input type="number" value={orderForm.price} onChange={e => setOrderForm({ ...orderForm, price: e.target.value })}
                  className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plum-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink-600 mb-1">Kapora (₺)</label>
                <input type="number" value={orderForm.depositPaid} onChange={e => setOrderForm({ ...orderForm, depositPaid: e.target.value })}
                  className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plum-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink-600 mb-1">Teslim Tarihi</label>
                <input type="date" value={orderForm.deliveryDate} onChange={e => setOrderForm({ ...orderForm, deliveryDate: e.target.value })}
                  className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plum-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink-600 mb-1">Çalışan</label>
                <select value={orderForm.employeeId} onChange={e => setOrderForm({ ...orderForm, employeeId: e.target.value })}
                  className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plum-500">
                  <option value="">Seçiniz...</option>
                  {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                </select>
              </div>
            </div>
            <button onClick={handleSaveOrder} className="w-full mt-6 bg-plum-600 hover:bg-plum-700 text-white font-medium py-2.5 rounded-xl transition-all">
              Kaydet
            </button>
          </div>
        </div>
      )}

      {/* Yeni Müşteri Formu */}
      {showCustomerForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-7 w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-ink-900">Yeni Müşteri</h2>
              <button onClick={() => setShowCustomerForm(false)}><X size={20} className="text-ink-400" /></button>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {[['name', 'Ad Soyad'], ['phone', 'Telefon'], ['email', 'Email'], ['notes', 'Notlar'],
                ['chest', 'Göğüs (cm)'], ['waist', 'Bel (cm)'], ['hip', 'Kalça (cm)'],
                ['shoulder', 'Omuz (cm)'], ['height', 'Boy (cm)'], ['armLength', 'Kol Boyu (cm)']].map(([key, label]) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-ink-600 mb-1">{label}</label>
                  <input value={(customerForm as any)[key]} onChange={e => setCustomerForm({ ...customerForm, [key]: e.target.value })}
                    className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plum-500" />
                </div>
              ))}
            </div>
            <button onClick={handleSaveCustomer} className="w-full mt-6 bg-plum-600 hover:bg-plum-700 text-white font-medium py-2.5 rounded-xl transition-all">
              Kaydet
            </button>
          </div>
        </div>
      )}
    </div>
  )
}