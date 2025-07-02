import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import ProviderSidebar from './ProviderSidebar';
import ProviderHeader from './ProviderHeader';
import ProtectedRoute from '../../pages/Protectedroute';

const ProviderLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <ProtectedRoute roles={['provider']}>
      <Box sx={{ 
        display: 'flex', 
        minHeight: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        {/* Sidebar Drawer */}
        <ProviderSidebar open={sidebarOpen} onClose={toggleSidebar} isMobile={isMobile} />

        {/* Main Content Area */}
        <Box sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: `calc(100% - ${sidebarOpen ? '260px' : '0px'})`,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.standard,
          }),
          ...(sidebarOpen && !isMobile && {
            width: `calc(100% - 260px)`,
          }),
        }}>
          {/* Header */}
          <ProviderHeader toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
          <Toolbar />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: { xs: 2, md: 3 },
              backgroundColor: '#fff',
              minHeight: 'calc(100vh - 70px)',
              overflow: 'auto',
              borderRadius: '12px 12px 0 0',
              boxShadow: '0 0 20px rgba(0, 0, 0, 0.03)',
              maxWidth: '100%',
              mx: 'auto',
              width: '100%'
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </ProtectedRoute>
  );
};

export default ProviderLayout;