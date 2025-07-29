import React, { useEffect, useState } from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Badge,
  Box,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import ReviewsIcon from '@mui/icons-material/Reviews';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import BarChartIcon from '@mui/icons-material/BarChart';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase';
import { useAuth } from '../AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

const drawerWidth = 260;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/provider/dashboard' },
  { text: 'Service Requests', icon: <BookOnlineIcon />, path: '/provider/requests' },
  { text: 'My Reviews', icon: <ReviewsIcon />, path: '/provider/reviews' },
  { text: 'My Reports', icon: <BarChartIcon />, path: '/provider/reports' },
  { text: 'Profile', icon: <PersonIcon />, path: '/provider/profile' },
  { text: 'Messages', icon: <MessageIcon />, path: '/provider/messages' },
];

interface ProviderSidebarProps {
  open: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const ProviderSidebar: React.FC<ProviderSidebarProps> = ({ open, onClose, isMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth ? useAuth() : { user: null };
  const [unread, setUnread] = useState(false);

  useEffect(() => {
    if (!user) return;
    const chatsRef = collection(db, 'chats');
    const unsubscribe = onSnapshot(chatsRef, (snapshot) => {
      let hasUnread = false;
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (!data.lastMessage || !data.lastRead) return;
        const lastRead = data.lastRead[String(user.id)] || 0;
        const lastMsgTime = data.lastMessage.createdAt?.toMillis ? data.lastMessage.createdAt.toMillis() : 0;
        if (lastMsgTime > lastRead) {
          hasUnread = true;
        }
      });
      setUnread(hasUnread);
    });
    return () => unsubscribe();
  }, [user]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#fff',
          color: '#334155',
          borderRight: '1px solid #e2e8f0',
          boxShadow: '4px 0 20px rgba(0, 0, 0, 0.03)',
        },
      }}
    >
      <Toolbar sx={{
        minHeight: '70px !important',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#147c3c',
        color: '#fff',
        px: 2
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          justifyContent: isSmallScreen ? 'center' : 'flex-start'
        }}>
          <Box sx={{
            width: 40,
            height: 40,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2
          }}>
            <PersonIcon sx={{ color: '#fff', fontSize: 24 }} />
          </Box>
          {!isSmallScreen && (
            <Typography variant="h6" fontWeight={700}>
              Provider Hub
            </Typography>
          )}
        </Box>
      </Toolbar>

      <Divider sx={{ borderColor: '#e2e8f0' }} />

      <List sx={{ py: 1 }}>
        {menuItems.map(({ text, icon, path }) => {
          const isSelected = location.pathname === path;
          return (
            <ListItemButton
              key={text}
              selected={isSelected}
              onClick={() => {
                navigate(path);
                if (isMobile) onClose();
              }}
              sx={{
                borderRadius: '8px',
                mx: 1.5,
                my: 0.5,
                px: 2,
                py: 1,
                color: isSelected ? '#147c3c' : '#64748b',
                '&.Mui-selected': {
                  backgroundColor: 'rgba(20, 124, 60, 0.1)',
                  color: '#147c3c',
                  '& .MuiListItemIcon-root': {
                    color: '#147c3c',
                  }
                },
                '&:hover': {
                  backgroundColor: 'rgba(20, 124, 60, 0.05)',
                  color: '#147c3c',
                  '& .MuiListItemIcon-root': {
                    color: '#147c3c',
                  }
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: '40px', color: isSelected ? '#147c3c' : '#94a3b8' }}>
                {text === 'Messages' ? (
                  <Badge color="error" variant="dot" invisible={!unread}>
                    {icon}
                  </Badge>
                ) : icon}
              </ListItemIcon>
              <ListItemText
                primary={text}
                primaryTypographyProps={{
                  fontWeight: isSelected ? 600 : 500,
                  fontSize: '0.95rem'
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ mt: 'auto', p: 2.5, textAlign: 'center' }}>
        <Typography variant="caption" color="#94a3b8">
          Provider Hub v1.0
        </Typography>
      </Box>
    </Drawer>
  );
};

export default ProviderSidebar;
