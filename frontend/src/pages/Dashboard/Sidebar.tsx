import {
  LayoutDashboard,
  Users,
  BriefcaseBusiness,
  BarChart3,
  CalendarDays,
  Image,
  Settings,
  Scissors,
  LogOut,
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="logo-container">
          <div className="logo-icon">
            <Scissors size={22} />
          </div>

          <div>
            <h2>TerziPro</h2>
            <span>Atölye Sistemi</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          <button className="menu-item active">
            <LayoutDashboard size={20} />
            Dashboard
          </button>

          <button className="menu-item">
            <Users size={20} />
            Müşteri & Sipariş
          </button>

          <button className="menu-item">
            <BriefcaseBusiness size={20} />
            Çalışan Yönetimi
          </button>

          <button className="menu-item">
            <BarChart3 size={20} />
            Muhasebe & Rapor
          </button>

          <button className="menu-item">
            <CalendarDays size={20} />
            Randevu Sistemi
          </button>

          <button className="menu-item">
            <Image size={20} />
            Sipariş Galerisi
          </button>

          <button className="menu-item">
            <Settings size={20} />
            Genel Ayarlar
          </button>
        </nav>
      </div>

      <div className="sidebar-user">

        <div className="avatar">
          MY
        </div>

        <div className="user-info">
          <strong>Melike Yılmaz</strong>
          <span>Baş Terzi</span>
        </div>

        <LogOut size={18} />
      </div>
    </aside>
  );
}

export default Sidebar;