import { useEffect, useState, useRef } from 'react'
import { Camera, Upload } from 'lucide-react'
import { api } from '../../lib/api'


export default function Gallery() {
  const [orders, setOrders] = useState<any[]>([])
  const [filter, setFilter] = useState('all')
  const [uploading, setUploading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    api.get('/orders').then(r => setOrders(r.data)).catch(console.error)
  }, [])

  const withPhotos = orders.filter(o => o.photoUrl)
  const filtered = filter === 'all' ? withPhotos : withPhotos.filter(o => o.id === Number(filter))

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedOrder) return alert('Sipariş seçin!')
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('photo', file)
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      await api.patch(`/orders/${selectedOrder}/status`, { photoUrl: res.data.url })
      const ordersRes = await api.get('/orders')
      setOrders(ordersRes.data)
    } catch (error) {
      alert('Yükleme hatası!')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-8 md:p-14 mt-12 md:mt-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink-900">Sipariş Fotoğrafları</h1>
          <p className="text-ink-500 text-sm mt-1.5">{withPhotos.length} fotoğraf</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={selectedOrder} onChange={e => setSelectedOrder(e.target.value)}
            className="flex-1 md:flex-none border border-ink-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-plum-500">
            <option value="">Sipariş seç...</option>
            {orders.map(o => (
              <option key={o.id} value={o.id}>#{o.id} - {o.customer?.name}</option>
            ))}
          </select>
          <button onClick={() => fileRef.current?.click()} disabled={uploading}
            className="flex items-center gap-2 bg-plum-600 hover:bg-plum-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50">
            <Upload size={18} />
            <span className="hidden md:inline">{uploading ? 'Yükleniyor...' : 'Fotoğraf Ekle'}</span>
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </div>
      </div>

      <div className="stitch mb-6" />

      <div className="flex gap-2.5 mb-8 flex-wrap">
        <button onClick={() => setFilter('all')}
          className={`px-4 md:px-5 py-2 md:py-2.5 rounded-full text-sm font-medium transition-all ${filter === 'all' ? 'bg-plum-600 text-white' : 'bg-white text-ink-600 border border-ink-200'}`}>
          Tümü
        </button>
        {withPhotos.map(o => (
          <button key={o.id} onClick={() => setFilter(String(o.id))}
            className={`px-4 md:px-5 py-2 md:py-2.5 rounded-full text-sm font-medium transition-all ${filter === String(o.id) ? 'bg-plum-600 text-white' : 'bg-white text-ink-600 border border-ink-200'}`}>
            #{o.id}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-ink-100">
          <Camera size={48} className="text-ink-300 mx-auto mb-4" />
          <p className="text-ink-400">Henüz fotoğraf eklenmemiş</p>
          <p className="text-sm text-ink-300 mt-1">Sipariş seçip fotoğraf ekleyebilirsiniz</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filtered.map(order => (
            <div key={order.id} className="relative group rounded-2xl overflow-hidden bg-white shadow-sm border border-ink-100">
              <img src={order.photoUrl} alt={order.description} className="w-full h-56 md:h-64 object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-end">
                <div className="p-4 text-white">
                  <p className="font-medium">#{order.id}</p>
                  <p className="text-sm">{order.customer?.name}</p>
                  <p className="text-xs opacity-75">{order.description}</p>
                </div>
              </div>
              <div className="absolute top-3 left-3">
                <span className="bg-plum-600 text-white text-xs px-2 py-1 rounded-full font-medium">#{order.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}