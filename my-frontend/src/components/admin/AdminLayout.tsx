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
        overflow: 'hidden', 
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: '240px', 
         flexShrink: 0,
          bgcolor: '#147c3c',
          color: '#fff',
          display: 'flex',
          overflow: 'hidden',
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
          minWidth: 0,
         
        }}
      >
        {/* Header */}
        <Box
          sx={{
            height: '64px',
            bgcolor: '#147c3c',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            px: 3,
            boxShadow: 1,
            flexShrink: 0,
          }}
        >
          <Header />
        </Box>

        {/* Main Body */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            padding: 3,
            backgroundColor: '#ffffff',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
