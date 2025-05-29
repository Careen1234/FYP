// src/components/admin/Sidebar.tsx
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
import PeopleIcon from '@mui/icons-material/People';
import BuildIcon from '@mui/icons-material/Build';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import PaymentIcon from '@mui/icons-material/Payment';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import { useLocation, useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
  { text: 'User Management', icon: <PeopleIcon />, path: '/admin/users' },
  { text: 'Provider Management', icon: <BuildIcon />, path: '/admin/providers' },
  { text: 'Service Management', icon: <BookOnlineIcon />, path: '/admin/services' },
  { text: 'Bookings Management', icon: <BookOnlineIcon />, path: '/admin/bookings' },
  { text: 'Payments Management', icon: <PaymentIcon />, path: '/admin/payments' },
  { text: 'Reports & Analytics', icon: <BarChartIcon />, path: '/admin/reports' },
  { text: 'CMS Pages', icon: <DescriptionIcon />, path: '/admin/cms' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
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
      <Divider sx={{ borderColor: '#147c3c' }} />
      <List>
        {menuItems.map(({ text, icon, path }) => {
          const isSelected = location.pathname === path;
          return (
            <ListItemButton
              
              key={text}
              selected={isSelected}
              onClick={() => navigate(path)}
              sx={{
                color: '#fff',
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover': {
                  backgroundColor: '#147c3c)',
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

export default Sidebar;
