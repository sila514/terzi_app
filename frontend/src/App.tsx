import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard/Dashboard";
import Customers from "./pages/Customers/Customers";
import Orders from "./pages/Orders/Orders";
import Employees from "./pages/Employees/Employees";
import Accounting from "./pages/Accounting/Accounting";
import Settings from "./pages/Settings/Settings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/employees" element={<Employees />} />
      <Route path="/accounting" element={<Accounting />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default App;