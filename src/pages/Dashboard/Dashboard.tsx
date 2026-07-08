import { useEffect, useState } from 'react'
import { Clock, CheckCircle, TrendingUp, AlertTriangle } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { api } from '../../lib/api'


export default function Dashboard() {
  const [data, setData] = useState<any>(null)
  const [monthly, setMonthly] = useState<any[]>([])
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    api.get('/dashboard').then(r => setData(r.data)).catch(console.error)
    api.get('/reports/monthly?year=2026').then(r => setMonthly(r.data)).catch(console.error)
  }, [])

  const today = new Date().toLocaleDateString('tr-TR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  const statCards = [
    { label: 'Aktif Sipariş', value: data?.activeOrders || 0, icon: Clock, tint: 'bg-brand-50 text-brand-700', sub: 'Devam eden işler' },
    { label: 'Bugün Teslim', value: data?.todayDeliveries?.length || 0, icon: CheckCircle, tint: 'bg-emerald-50 text-emerald-600', sub: 'Bugün teslim edilecek' },
    { label: 'Geciken', value: data?.overdueOrders?.length || 0, icon: AlertTriangle, tint: 'bg-rose-50 text-rose-600', sub: 'Teslim tarihi geçmiş' },
    { label: 'Aylık Ciro', value: `${(data?.monthlyRevenue || 0).toLocaleString('tr-TR')} ₺`, icon: TrendingUp, tint: 'bg-amber-50 text-amber-600', sub: 'Bu ay tahsil edilen' },
  ]

  return (
    <div className="p-8 md:p-14 bg-paper min-h-screen">
      <div className="mb-7 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Hoş geldiniz, {user.name} 👋</h1>
        <p className="text-gray-400 mt-1.5 text-sm">{today}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-9 md:mb-12">
        {statCards.map(({ label, value, icon: Icon, tint, sub }) => (
          <div key={label} className="bg-white rounded-2xl p-6 md:p-7 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4 md:mb-5">
              <p className="text-xs md:text-sm text-gray-500 font-medium">{label}</p>
              <div className={`w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center ${tint}`}>
                <Icon size={17} />
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-semibold text-gray-900 mb-1.5">{value}</p>
            <p className="text-xs text-gray-400 hidden md:block">{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-9 md:mb-12">
        <div className="md:col-span-2 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div>
              <h2 className="font-semibold text-gray-900 text-sm md:text-base">Gelir & Gider Trendi</h2>
              <p className="text-xs text-gray-400 mt-1">2026 yıllık görünüm</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-500 inline-block"></span> Gelir</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400 inline-block"></span> Gider</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthly}>
              <defs>
                <linearGradient id="gelir" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F6BFF" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4F6BFF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gider" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(val: any) => `${val?.toLocaleString('tr-TR')} ₺`} />
              <Area type="monotone" dataKey="revenue" stroke="#4F6BFF" fill="url(#gelir)" strokeWidth={2} name="Gelir" />
              <Area type="monotone" dataKey="expenses" stroke="#f43f5e" fill="url(#gider)" strokeWidth={2} name="Gider" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">Sipariş Durumu</h2>
          <p className="text-xs text-gray-400 mb-5 md:mb-7">Mevcut durum dağılımı</p>
          <div className="space-y-5">
            {[
              { label: 'Aktif', color: 'bg-brand-500', count: data?.activeOrders || 0 },
              { label: 'Teslim', color: 'bg-emerald-500', count: data?.todayDeliveries?.length || 0 },
              { label: 'Geciken', color: 'bg-rose-500', count: data?.overdueOrders?.length || 0 },
            ].map(({ label, color, count }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600 text-xs md:text-sm">{label}</span>
                  <span className="font-medium text-gray-900">{count}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className={`${color} h-2.5 rounded-full transition-all`} style={{ width: `${Math.min((count / Math.max(data?.activeOrders || 1, 1)) * 100, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alt Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle size={16} className="text-rose-500" />
            <h2 className="font-semibold text-gray-900 text-sm md:text-base">Geciken Siparişler</h2>
            {data?.overdueOrders?.length > 0 && (
              <span className="ml-auto text-xs bg-rose-100 text-rose-600 px-2 py-1 rounded-full font-medium">
                {data.overdueOrders.length} adet
              </span>
            )}
          </div>
          {!data?.overdueOrders?.length ? (
            <p className="text-gray-400 text-sm text-center py-6">🎉 Geciken sipariş yok</p>
          ) : (
            <div className="space-y-3">
              {data.overdueOrders.slice(0, 4).map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-rose-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{order.customer?.name}</p>
                    <p className="text-xs text-gray-500">{order.description}</p>
                  </div>
                  <p className="text-xs text-rose-500 font-medium">
                    {new Date(order.deliveryDate).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-5">
            <CheckCircle size={16} className="text-emerald-500" />
            <h2 className="font-semibold text-gray-900 text-sm md:text-base">Bugünkü Teslimler</h2>
          </div>
          {!data?.todayDeliveries?.length ? (
            <p className="text-gray-400 text-sm text-center py-6">Bugün teslim edilecek sipariş yok</p>
          ) : (
            <div className="space-y-3">
              {data.todayDeliveries.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{order.customer?.name}</p>
                    <p className="text-xs text-gray-500">{order.description}</p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600">
                    {order.price?.toLocaleString('tr-TR')} ₺
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}