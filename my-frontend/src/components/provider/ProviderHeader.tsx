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
import MenuIcon from '@mui/icons-material/Menu';

interface ProviderHeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const ProviderHeader: React.FC<ProviderHeaderProps> = ({ toggleSidebar, sidebarOpen }) => {
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
        width: '100%',
        backgroundColor: '#147c3c',
        boxShadow: 'none',
        height: '64px',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', height: '64px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleSidebar}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Provider Dashboard
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              backgroundColor: '#147c3c',
              px: 1,
              borderRadius: 1,
              '&:hover': { backgroundColor: '#126e35' },
              width: { sm: '200px', md: '300px' },
            }}
          >
            <SearchIcon sx={{ color: 'white', mr: 1 }} />
            <InputBase 
              placeholder="Search…" 
              sx={{ color: 'white', width: '100%' }} 
            />
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

export default ProviderHeader;