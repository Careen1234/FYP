// src/components/admin/Header.tsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';

const drawerWidth = 240;

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        backgroundColor: '#2e7d32',
        boxShadow: 'none',
        height: '64px',          // Explicitly set height
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', height: '64px' }}>
        <Typography variant="h6">Admin Dashboard</Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.15)',
              px: 1,
              borderRadius: 1,
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.25)' },
              width: '300px',
            }}
          >
            <SearchIcon sx={{ color: 'white', mr: 1 }} />
            <InputBase placeholder="Search…" sx={{ color: 'white', width: '100%' }} />
          </Box>

          <Tooltip title="Account settings">
            <IconButton onClick={handleMenuOpen} sx={{ color: 'white' }}>
              <AccountCircle fontSize="large" />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
