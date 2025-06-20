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
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  // Added logout function here
  const handleLogout = async () => {
    handleMenuClose(); // close menu first
    try {
      await axios.post('/api/logout', {}, { withCredentials: true });
      localStorage.removeItem('role');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
      // You can optionally add user feedback here
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        backgroundColor: '#147c3c',
        boxShadow: 'none',
        height: '64px',          
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', height: '64px' }}>
        <Typography variant="h6">Admin Dashboard</Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#147c3c',
              px: 1,
              borderRadius: 1,
              '&:hover': { backgroundColor: '#147c3c)' },
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
            <MenuItem onClick={handleLogout}>Logout</MenuItem> {/* <-- Logout linked */}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
