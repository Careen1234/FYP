import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar, IconButton, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ProviderSidebar from './ProviderSidebar';
import ProviderHeader from './ProviderHeader';

const ProviderLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
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
        {/* Header with menu toggle button */}
        <ProviderHeader toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

        {/* Toolbar placeholder to push content below AppBar */}
        <Toolbar />

        {/* Page Content */}
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
  );
};

export default ProviderLayout;