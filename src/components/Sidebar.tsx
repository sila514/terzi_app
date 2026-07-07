import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, UserCog, BarChart3,
  Image, Settings, LogOut, Scissors, Menu, X
} from 'lucide-react'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/customers', label: 'Müşteri & Sipariş', icon: Users },
  { to: '/employees', label: 'Çalışan Yönetimi', icon: UserCog },
  { to: '/accounting', label: 'Muhasebe & Rapor', icon: BarChart3 },
  { to: '/gallery', label: 'Sipariş Fotoğrafları', icon: Image },
  { to: '/settings', label: 'Genel Ayarlar', icon: Settings },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-purple-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-purple-600 rounded-lg flex items-center justify-center">
              <Scissors size={18} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-base text-white">TerziPro</p>
              <p className="text-xs text-purple-300">Atölye Sistemi</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="md:hidden text-purple-300">
            <X size={20} />
          </button>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1.5">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                isActive
                  ? 'bg-purple-600 text-white font-medium'
                  : 'text-purple-200 hover:bg-purple-800'
              }`
            }
          >
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-purple-800">
        <div className="flex items-center gap-3 px-3 py-2.5 mb-2">
          <div className="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
            {user.name?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{user.name || 'Kullanıcı'}</p>
            <p className="text-xs text-purple-300">{user.role === 'ADMIN' ? 'Yönetici' : 'Çalışan'}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 w-full text-purple-200 hover:bg-purple-800 rounded-xl text-sm transition-all">
          <LogOut size={18} />
          Çıkış Yap
        </button>
      </div>
    </div>
  )

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-purple-900 text-white flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-purple-600 rounded-lg flex items-center justify-center">
            <Scissors size={14} className="text-white" />
          </div>
          <span className="font-bold text-sm text-white">TerziPro</span>
        </div>
        <button onClick={() => setOpen(true)} className="text-white">
          <Menu size={22} />
        </button>
      </div>

      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-purple-900 text-white h-full shadow-2xl">
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
        </div>
      )}

      <div className="hidden md:flex w-64 shrink-0 bg-purple-900 text-white flex-col h-screen">
        <SidebarContent />
      </div>
    </>
  )
}