import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/public/Navbar';
import Hero from './components/public/Hero';
import Services from './pages/public/Services';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UsersManagement';
import ProviderManagement from './pages/admin/ProviderManagement';
import ServiceManagement from './pages/admin/ServiceManagement';
import BookingManagement from './pages/admin/BookingManagement';
import PaymentManagement from './pages/admin/PaymentManagement';
import Reports from './pages/admin/Reports';
import UserLayout from './pages/user/UserLayout'
import RegisterForm from './components/Register';
import CMS from './pages/admin/CmsPages'
import Login from './components/Login';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary';

const Home = () => (
  <>
    <Hero />
    <Services />
  </>
);

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isUserRoute = location.pathname.startsWith('/user');

  return (
    <div className="app">
      {!isAdminRoute && !isUserRoute && <Navbar />}

      <ErrorBoundary>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/servicespublic" element={<Services />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<Login />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="providers" element={<ProviderManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="services" element={<ServiceManagement />} />
            <Route path="bookings" element={<BookingManagement />} />
            <Route path="reports" element={<Reports />} />
            <Route path="payments" element={<PaymentManagement />} />
            <Route path="cms" element={<CMS />} />
          </Route>

          {/* User */}
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<h2>Welcome to User Dashboard</h2>} />
            <Route path="dashboard" element={<h2>User Dashboard</h2>} />
          </Route>

          {/* 404 fallback */}
          <Route path="*" element={<h2>404 Page Not Found</h2>} />
        </Routes>
      </ErrorBoundary>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
