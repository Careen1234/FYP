import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, CssBaseline } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BuildIcon from '@mui/icons-material/Build';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InboxIcon from '@mui/icons-material/Inbox';
import ScheduleIcon from '@mui/icons-material/Schedule';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import RateReviewIcon from '@mui/icons-material/RateReview';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const drawerWidth = 240;

const ServiceProviderDashboard: React.FC = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Service Provider Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        <ListItemButton>
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItemButton>
                        <ListItemButton selected>
                            <ListItemIcon>
                                <BuildIcon />
                            </ListItemIcon>
                            <ListItemText primary="Manage Services" />
                        </ListItemButton>
                        <ListItemButton>
                            <ListItemIcon>
                                <AttachMoneyIcon />
                            </ListItemIcon>
                            <ListItemText primary="Update Price" />
                        </ListItemButton>
                        <ListItemButton>
                            <ListItemIcon>
                                <LocationOnIcon />
                            </ListItemIcon>
                            <ListItemText primary="Update Location" />
                        </ListItemButton>
                        <ListItemButton>
                            <ListItemIcon>
                                <InboxIcon />
                            </ListItemIcon>
                            <ListItemText primary="Incoming Requests" />
                        </ListItemButton>
                        <ListItemButton>
                            <ListItemIcon>
                                <ScheduleIcon />
                            </ListItemIcon>
                            <ListItemText primary="Scheduler" />
                        </ListItemButton>
                        <ListItemButton>
                            <ListItemIcon>
                                <MonetizationOnIcon />
                            </ListItemIcon>
                            <ListItemText primary="Earnings" />
                        </ListItemButton>
                        <ListItemButton>
                            <ListItemIcon>
                                <RateReviewIcon />
                            </ListItemIcon>
                            <ListItemText primary="Reviews" />
                        </ListItemButton>
                        <ListItemButton>
                            <ListItemIcon>
                                <SettingsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Profile & Settings" />
                        </ListItemButton>
                        <ListItemButton>
                            <ListItemIcon>
                                <ExitToAppIcon />
                            </ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItemButton>
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Typography variant="h5" gutterBottom>
                    Active Jobs
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                    <Box sx={{ width: 200, height: 100, bgcolor: '#e0e0e0', borderRadius: 2 }} />
                    <Box sx={{ width: 200, height: 100, bgcolor: '#e0e0e0', borderRadius: 2 }} />
                    <Box sx={{ width: 200, height: 100, bgcolor: '#e0e0e0', borderRadius: 2 }} />
                    <Box sx={{ width: 200, height: 100, bgcolor: '#e0e0e0', borderRadius: 2 }} />
                    <Box sx={{ width: 200, height: 100, bgcolor: '#e0e0e0', borderRadius: 2 }} />
                </Box>
                <Typography variant="h5" gutterBottom>
                    Notifications
                </Typography>
                <Box sx={{ bgcolor: '#e0e0e0', p: 2, borderRadius: 2, minHeight: 150 }}>
                    <Box sx={{ width: '100%', height: 15, bgcolor: '#bdbdbd', mb: 1 }} />
                    <Box sx={{ width: '100%', height: 15, bgcolor: '#bdbdbd', mb: 1 }} />
                    <Box sx={{ width: '100%', height: 15, bgcolor: '#bdbdbd' }} />
                </Box>
            </Box>
        </Box>
    );
};

export default ServiceProviderDashboard;