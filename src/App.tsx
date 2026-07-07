import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard/Dashboard'
import Customers from './pages/Customers/Customers'
import Employees from './pages/Employees/Employees'
import Accounting from './pages/Accounting/Accounting'
import Gallery from './pages/Gallery/Gallery'
import Settings from './pages/Settings/Settings'
import Login from './pages/Login/Login'

function App() {
  const token = localStorage.getItem('token')

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={token ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="employees" element={<Employees />} />
          <Route path="accounting" element={<Accounting />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App