import { Bell } from "lucide-react";

function Header() {
  return (
    <header className="header">
      <div className="header-info">
        <h1>Hoş geldiniz, Melike</h1>
        <p>Bugün resmen harika geçiyor! — 7 Temmuz 2026, Salı</p>
      </div>

      <button className="notification-button">
        <Bell size={20} />
        <span className="notification-dot"></span>
      </button>
    </header>
  );
}

export default Header;