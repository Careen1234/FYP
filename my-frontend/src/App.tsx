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
import CMS from './pages/admin/CmsPages'
import Login from './pages/serviceMatching/Login';
import Register from './pages/serviceMatching/RegisterUser';
import BecomeProvider from './pages/serviceMatching/RegisterProvider';
import RequestService from './pages/serviceMatching/RequestService';
//import Payment from './pages/public/Payment';
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
       
        <Route path="/servicespublic" element={<Services />}/>
        <Route
          path="/login"
          element={
            <Login
              onLogin={(identifier: string, role: 'user' | 'provider') => {
                // TODO: handle login logic here, e.g., set user context or redirect
                console.log('Logged in:', identifier, role);
              }}
            />
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/become-provider" element={<BecomeProvider />} />
        <Route path="/request-service" element={<RequestService />} />
       


        {/* Admin Routes */}
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
