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
  Divider,
  ListItemText,
  Badge,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { logout } from '../../pages/Authlogout';  // <-- import logout
import { useNavigate } from 'react-router-dom';   // <-- import navigate hook


interface ProviderHeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const ProviderHeader: React.FC<ProviderHeaderProps> = ({ toggleSidebar, sidebarOpen }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
   const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const notifOpen = Boolean(notifAnchor);
  const navigate = useNavigate();  // <-- initialize navigate

    // Simulate unread messages
  const unreadMessages = [
    { id: 1, sender: 'Admin', content: 'Your account is under review' },
    { id: 2, sender: 'User123', content: 'Booking request sent' },
  ];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

    const handleNotifOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotifAnchor(event.currentTarget);
  };

  const handleNotifClose = () => setNotifAnchor(null);

  const handleProfileClick = () => {
    navigate('/provider/profile');
    handleMenuClose();
  };

  // <-- Add logout handler here
  const handleLogout = async () => {
    handleMenuClose();
    const result = await logout();
    if (result) navigate('/login');
  };

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


          {/* Notification Bell */}
          <Tooltip title="Messages">
            <IconButton sx={{ color: 'white' }} onClick={handleNotifOpen}>
              <Badge badgeContent={unreadMessages.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Notification Dropdown */}
          <Menu
            anchorEl={notifAnchor}
            open={notifOpen}
            onClose={handleNotifClose}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          >
            {unreadMessages.length > 0 ? (
              unreadMessages.map((msg) => (
                <MenuItem
                  key={msg.id}
                  onClick={() => {
                    navigate('/provider/messages');
                    handleNotifClose();
                  }}
                >
                  <ListItemText
                    primary={msg.sender}
                    secondary={msg.content}
                    sx={{ maxWidth: '250px' }}
                  />
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No new messages</MenuItem>
            )}
            <Divider />
            <MenuItem onClick={() => navigate('/provider/messages')}>
              View All Messages
            </MenuItem>
          </Menu>
          
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
            <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
            {/* <-- call logout handler on logout menu item */}
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default ProviderHeader;
