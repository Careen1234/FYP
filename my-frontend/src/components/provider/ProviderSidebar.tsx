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
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import ReviewsIcon from '@mui/icons-material/Reviews';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase';
import { useAuth } from '../AuthContext';

import { useLocation, useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/provider/dashboard' },
  { text: 'Service Requests', icon: <BookOnlineIcon />, path: '/provider/requests' },
  { text: 'My Reviews', icon: <ReviewsIcon />, path: '/provider/reviews' },
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
    // Listen to all chats where this provider is a participant
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

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }} // Better open performance on mobile
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#147c3c',
          color: '#fff',
        },
      }}
    >
      <Toolbar />
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
      <List>
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
                color: '#fff',
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover': {
                  backgroundColor: '#126e35',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#fff' }}>
                {text === 'Messages' ? (
                  <Badge color="error" variant="dot" invisible={!unread}>
                    {icon}
                  </Badge>
                ) : icon}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
};

export default ProviderSidebar;