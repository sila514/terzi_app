import { Clock3, CircleCheckBig, TrendingUp } from "lucide-react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import StatCard from "./StatCard";
import NotificationList from "./NotificationList";
import AppointmentList from "./AppointmentList";

function Dashboard() {
  return (
    <div className="dashboard">
      <Sidebar />

      <div className="content">
        <Header />

        <div className="stats">

    <StatCard
        title="Aktif Sipariş"
        value="3"
        subtitle="Devam eden işler"
        color="#6F4BF2"
        icon={<Clock3 size={24}/>}
    />

    <StatCard
        title="Tamamlanan"
        value="1"
        subtitle="Bu ay teslim edildi"
        color="#0BB783"
        icon={<CircleCheckBig size={24}/>}
    />

    <StatCard
        title="Aylık Gelir"
        value="32.500 ₺"
        subtitle="Haziran 2025"
        color="#C8A03A"
        icon={<TrendingUp size={24}/>}
    />

        </div>

        <div className="dashboard-bottom">
            <AppointmentList />
            <NotificationList />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;