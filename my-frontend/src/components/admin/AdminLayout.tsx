import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from '../admin/Sidebar';
import Header from '../admin/Header';
import ProtectedRoute from '../../pages/Protectedroute'; // adjust path if needed
import { logout } from '../../pages/Authlogout'; // adjust the path to where your logout function is defined

const drawerWidth = 240;
const headerHeight = 64;

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate('/login'); // or "/admin/login", "/provider/login"
    }
  };

  return (
    <ProtectedRoute roles={['admin']}>
      <>
        {/* Fixed Sidebar */}
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: drawerWidth,
            height: '100vh',
            bgcolor: '#147c3c',
            zIndex: 1200,
          }}
        >
          <Sidebar />
        </Box>

        {/* Fixed Header */}
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: drawerWidth,
            height: headerHeight,
            width: `calc(100% - ${drawerWidth}px)`,
            bgcolor: '#147c3c',
            display: 'flex',
            alignItems: 'center',
            px: 3,
            zIndex: 1100,
            boxShadow: 1,
          }}
        >
          <Header />
        </Box>

        {/* Scrollable Content Area */}
        <Box
          sx={{
            position: 'absolute',
            top: headerHeight,
            left: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            height: `calc(100vh - ${headerHeight}px)`,
            overflowY: 'auto',
            p: 3,
            bgcolor: '#ffffff',
          }}
        >
          <Outlet />
        </Box>
      </>
    </ProtectedRoute>
  );
};

export default AdminLayout;
