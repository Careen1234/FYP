import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import ProviderSidebar from './ProviderSidebar'; // Adjust path as needed
import ProviderHeader from './ProviderHeader';

const ProviderLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar Drawer */}
      <ProviderSidebar />

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <ProviderHeader />

        {/* Toolbar placeholder to push content below AppBar */}
        <Toolbar />

        {/* Page Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            height: '100vh',
            overflow: 'auto',
            backgroundColor: '#fff',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default ProviderLayout;
