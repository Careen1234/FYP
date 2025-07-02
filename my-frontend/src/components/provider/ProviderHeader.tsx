import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
  ListItemText,
  Badge,
  Avatar,
  useMediaQuery,
  useTheme
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { logout } from '../../pages/Authlogout';
import { useNavigate } from 'react-router-dom';

interface ProviderHeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const ProviderHeader: React.FC<ProviderHeaderProps> = ({ toggleSidebar, sidebarOpen }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const notifOpen = Boolean(notifAnchor);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const unreadMessages = [
    { id: 1, sender: 'Admin', content: 'Your account is under review', time: '2 hours ago' },
    { id: 2, sender: 'User123', content: 'Booking request sent', time: '5 hours ago' },
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
        backgroundColor: '#fff',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        height: '70px',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', height: '70px', padding: { xs: '0 12px', sm: '0 24px' } }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleSidebar}
            edge="start"
            sx={{ mr: 2, color: '#147c3c', display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', mr: { sm: 4, md: 6 } }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                backgroundColor: 'rgba(20, 124, 60, 0.1)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}
            >
              <AccountCircle sx={{ color: '#147c3c', fontSize: 28 }} />
            </Box>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ fontWeight: 700, color: '#0d5a2c', letterSpacing: '-0.5px' }}
            >
              Provider Hub
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          <Tooltip title="Messages">
            <IconButton
              sx={{
                color: '#64748b',
                position: 'relative',
                '&:hover': {
                  backgroundColor: 'rgba(20, 124, 60, 0.05)',
                }
              }}
              onClick={handleNotifOpen}
            >
              <Badge badgeContent={unreadMessages.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={notifAnchor}
            open={notifOpen}
            onClose={handleNotifClose}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            PaperProps={{
              sx: {
                width: 320,
                maxWidth: '100%',
                mt: 1.5,
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e2e8f0',
              }
            }}
          >
            <Box sx={{ p: 1.5, borderBottom: '1px solid #f1f5f9' }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Notifications
              </Typography>
            </Box>

            {unreadMessages.length > 0 ? (
              unreadMessages.map((msg) => (
                <MenuItem
                  key={msg.id}
                  onClick={() => {
                    navigate('/provider/messages');
                    handleNotifClose();
                  }}
                  sx={{
                    py: 1.5,
                    borderBottom: '1px solid #f8fafc',
                    '&:hover': {
                      backgroundColor: 'rgba(20, 124, 60, 0.03)',
                    }
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography fontWeight={600} fontSize="0.9rem">
                          {msg.sender}
                        </Typography>
                        <Typography fontSize="0.75rem" color="#94a3b8">
                          {msg.time}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography fontSize="0.875rem" color="#64748b">
                        {msg.content}
                      </Typography>
                    }
                  />
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled sx={{ py: 2, justifyContent: 'center' }}>
                <Typography color="#94a3b8">No new messages</Typography>
              </MenuItem>
            )}
            <Divider sx={{ my: 0.5 }} />
            <MenuItem
              onClick={() => navigate('/provider/messages')}
              sx={{
                py: 1.5,
                justifyContent: 'center',
                color: '#147c3c',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(20, 124, 60, 0.05)',
                }
              }}
            >
              View All Messages
            </MenuItem>
          </Menu>

          <Tooltip title="Account settings">
            <IconButton
              onClick={handleMenuOpen}
              sx={{
                p: 0,
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  backgroundColor: 'rgba(20, 124, 60, 0.1)',
                  color: '#147c3c'
                }}
              >
                <AccountCircle fontSize="medium" />
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            PaperProps={{
              sx: {
                width: 220,
                mt: 1.5,
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e2e8f0',
                '& .MuiMenuItem-root': {
                  fontSize: '0.9rem',
                  padding: '10px 16px',
                }
              }
            }}
          >
            <Box sx={{ p: 1.5, borderBottom: '1px solid #f1f5f9' }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Account
              </Typography>
            </Box>
            <MenuItem onClick={handleProfileClick}>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default ProviderHeader;
