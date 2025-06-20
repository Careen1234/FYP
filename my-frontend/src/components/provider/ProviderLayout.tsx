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
    <ProtectedRoute roles={['provider']}> {/* ✅ Only providers allowed */}
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sidebar Drawer */}
        <ProviderSidebar open={sidebarOpen} onClose={toggleSidebar} isMobile={isMobile} />

        {/* Main Content Area */}
        <Box sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: `calc(100% - ${sidebarOpen ? '240px' : '0px'})`,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(sidebarOpen && !isMobile && {
            width: `calc(100% - 240px)`,
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
              minHeight: 'calc(100vh - 64px)',
              overflow: 'auto',
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
