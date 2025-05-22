import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from '../admin/Sidebar';
import Header from '../admin/Header';

const AdminLayout: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#ffffff',
        // overflow: 'hidden', // Removed to allow scrolling inside content
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: 240,
          flexShrink: 0,
          bgcolor: '#2e7d32', // Green
          color: '#fff',
        }}
      >
        <Sidebar />
      </Box>

      {/* Main content */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,  // Prevent content shrinking issues
        }}
      >
        {/* Header */}
        <Box
          sx={{
            height: 64,
            bgcolor: '#2e7d32', // Green
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            px: 3,
            boxShadow: 1,
          }}
        >
          <Header />
        </Box>

        {/* Main Body */}
        <Box
          sx={{
            flexGrow: 1,
            backgroundColor: '#ffffff',
            overflowX: 'auto',
            overflowY: 'auto',
            padding: 3,
             maxWidth: '100%',
            minHeight: '100vh',
            width: '100%',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
