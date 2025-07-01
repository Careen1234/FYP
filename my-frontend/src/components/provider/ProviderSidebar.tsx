import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import ReviewsIcon from '@mui/icons-material/Reviews';
import PersonIcon from '@mui/icons-material/Person';
import { useLocation, useNavigate } from 'react-router-dom';
import { BarChartIcon } from 'lucide-react';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/provider/dashboard' },
  { text: 'Service Requests', icon: <BookOnlineIcon />, path: '/provider/requests' },
  { text: 'My Reviews', icon: <ReviewsIcon />, path: '/provider/reviews' },
  { text: 'My Reports', icon: <BarChartIcon />, path: '/provider/reports' },
  { text: 'Profile', icon: <PersonIcon />, path: '/provider/profile' },
];

interface ProviderSidebarProps {
  open: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const ProviderSidebar: React.FC<ProviderSidebarProps> = ({ open, onClose, isMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();

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
              <ListItemIcon sx={{ color: '#fff' }}>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
};

export default ProviderSidebar;