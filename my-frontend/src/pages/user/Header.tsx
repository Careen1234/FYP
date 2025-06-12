import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);

  const openProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const closeProfileMenu = () => {
    setAnchorEl(null);
  };

  const openNotifMenu = (event: React.MouseEvent<HTMLElement>) => {
    setNotifAnchorEl(event.currentTarget);
  };
  const closeNotifMenu = () => {
    setNotifAnchorEl(null);
  };

  // Mock unread notifications count
  const unreadCount: number = 3;

  return (
    <AppBar position="static" sx={{ bgcolor: '#147c3c' }}>
      <Toolbar sx={{ justifyContent: 'flex-end', gap: 2 }}>
        {/* Notification Icon */}
        <IconButton
          color="inherit"
          onClick={openNotifMenu}
          aria-controls={notifAnchorEl ? 'notif-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={notifAnchorEl ? 'true' : undefined}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        {/* Notification Menu */}
        <Menu
          id="notif-menu"
          anchorEl={notifAnchorEl}
          open={Boolean(notifAnchorEl)}
          onClose={closeNotifMenu}
          PaperProps={{
            sx: { width: 300, maxHeight: 350 },
          }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Typography variant="subtitle1" sx={{ px: 2, pt: 1 }}>
            Notifications
          </Typography>
          <Divider />
          {/* Example notification items */}
          <MenuItem onClick={closeNotifMenu}>New booking confirmed</MenuItem>
          <MenuItem onClick={closeNotifMenu}>Service provider updated</MenuItem>
          <MenuItem onClick={closeNotifMenu}>Payment received</MenuItem>
          {unreadCount === 0 && (
            <Typography sx={{ p: 2 }} color="text.secondary" align="center">
              No new notifications
            </Typography>
          )}
        </Menu>

        {/* Profile Avatar */}
        <IconButton
          onClick={openProfileMenu}
          sx={{ p: 0 }}
          aria-controls={anchorEl ? 'profile-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={anchorEl ? 'true' : undefined}
        >
          <Avatar sx={{ bgcolor: '#0e5728' }}>U</Avatar>
        </IconButton>

        {/* Profile Menu */}
        <Menu
          id="profile-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={closeProfileMenu}
          PaperProps={{
            sx: { width: 220 },
          }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={closeProfileMenu}>Profile Overview</MenuItem>
          <MenuItem onClick={closeProfileMenu}>Account Settings</MenuItem>
          <MenuItem onClick={closeProfileMenu}>Update Profile</MenuItem>
          <Divider />
          <MenuItem onClick={closeProfileMenu}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
