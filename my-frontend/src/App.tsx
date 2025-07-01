import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/public/Navbar";
import Home from "./pages/Home";
import { LanguageProvider } from "./contexts/LanguageContext";

import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UsersManagement";
import ProviderManagement from "./pages/admin/ProviderManagement";
import ServiceManagement from "./pages/admin/ServiceManagement";
import BookingManagement from "./pages/admin/BookingManagement";
import PaymentManagement from "./pages/admin/PaymentManagement";
import Reports from "./pages/admin/Reports";
import CMS from "./pages/admin/CmsPages";

import ProviderLayout from "./components/provider/ProviderLayout";
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import ProviderRequests from "./pages/provider/ProviderRequests";
import ProviderReviews from "./pages/provider/ProviderReviews";
import ProviderProfile from "./pages/provider/ProviderProfile";

import UserLayout from "./pages/user/UserLayout";

import Register from "./components/Register";
import Login from "./components/Login";
import Unauthorized from "./pages/Unauthorized";

import "./App.css";
import ProviderReports from "./pages/provider/ProviderReports";
//import BookingSuccess from "./pages/BookingSuccess";

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isUserRoute = location.pathname.startsWith("/user");
  const isProviderRoute = location.pathname.startsWith("/provider");

  const hideNavbar = isAdminRoute || isUserRoute || isProviderRoute;

  return (
    <div className="app">
      {!hideNavbar && <Navbar />}

      <Routes>        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

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

        {/* User Routes */}
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<h2>Welcome to User Dashboard</h2>} />
          <Route path="dashboard" element={<h2>User Dashboard</h2>} />
        

        </Route>

        {/* Provider Routes */}
        <Route path="/provider" element={<ProviderLayout />}>
          <Route path="dashboard" element={<ProviderDashboard />} />
          <Route path="requests" element={<ProviderRequests />} />
          <Route path="reviews" element={<ProviderReviews />} />
          <Route path="profile" element={<ProviderProfile />} />
          <Route path="reports" element={<ProviderReports />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<h2>404 Page Not Found</h2>} />
      </Routes>
    </div>
  );
};

const App = () => (
  <Router>
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  </Router>
);

export default App;
