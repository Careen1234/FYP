import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/public/Navbar';
import Hero from './components/public/Hero';
import Services from './pages/public/Services';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UsersManagement';
import ProviderManagement from './pages/admin/ProviderManagement';
//import ServiceManagement from './pages/admin/ServiceManagement';
//import BookingManagement from './pages/admin/BookingManagement';
//import ReportsAnalytics from './pages/admin/ReportsAnalytics';
import './App.css';

const Home = () => (
  <>
    <Hero />
    <Services />
  </>
);

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app">
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="providers" element={<ProviderManagement />} />
          <Route path="users" element={<UserManagement />} />
        
        
         
        </Route>

        {/* Redirect unknown admin paths */}
        <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
