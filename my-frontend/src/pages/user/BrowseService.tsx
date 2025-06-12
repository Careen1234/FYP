import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  TextField,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';

const categories = ['Home Services', 'Personal Care', 'Roadside Assistance'];

const services = [
  {
    id: 1,
    name: 'House Cleaning',
    category: 'Home Services',
    description: 'Full home cleaning including bedrooms, kitchen and floors.',
    price: 40,
    available: true,
    image: 'https://images.unsplash.com/photo-1581579182694-8c6e2e4e4031?auto=format&fit=crop&w=600&q=60',
  },
  {
    id: 2,
    name: 'Hair Styling',
    category: 'Personal Care',
    description: 'Professional hair styling at your convenience.',
    price: 25,
    available: true,
    image: 'https://images.unsplash.com/photo-1592761640858-4f8b6d097dc2?auto=format&fit=crop&w=600&q=60',
  },
  {
    id: 3,
    name: 'Flat Tire Help',
    category: 'Roadside Assistance',
    description: 'Fast and reliable tire change on the road.',
    price: 30,
    available: false,
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=60',
  },
];

const UserDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('services');

  return (
    <Box sx={{ display: 'flex', px: 3, py: 6, gap: 4 }}>
      {/* Sidebar */}
      <Paper elevation={3} sx={{ p: 3, minWidth: 280 }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>U</Avatar>
          <Box>
            <Typography variant="h6">User</Typography>
            <Typography variant="body2" color="text.secondary">user@email.com</Typography>
          </Box>
        </Box>

        <List>
          <ListItemButton selected={activeTab === 'services'} onClick={() => setActiveTab('services')}>
            <ListItemIcon><HomeIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Browse Services" />
          </ListItemButton>
          <ListItemButton selected={activeTab === 'requests'} onClick={() => setActiveTab('requests')}>
            <ListItemIcon><HistoryIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="My Requests" />
          </ListItemButton>
          <ListItemButton selected={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>
            <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </List>
      </Paper>

      {/* Main Content */}
      <Box sx={{ flex: 1 }}>
        {activeTab === 'services' && (
          <>
            <Typography variant="h5" fontWeight={600} mb={2}>Browse Services</Typography>
            <Typography variant="subtitle1" mb={3}>Categories: {categories.join(', ')}</Typography>

            <Grid container spacing={3}>
              {services.map((service) => (
                <Grid item xs={12} sm={6} md={4} key={service.id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="160"
                      image={service.image}
                      alt={service.name}
                    />
                    <CardContent>
                      <Typography variant="h6">{service.name}</Typography>
                      <Chip
                        label={service.category}
                        size="small"
                        color="primary"
                        sx={{ my: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {service.description}
                      </Typography>
                      <Typography mt={1} fontWeight="bold" color="success.main">
                        ${service.price}
                      </Typography>
                      <Typography variant="caption" color={service.available ? 'green' : 'error'}>
                        {service.available ? 'Available' : 'Unavailable'}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        fullWidth
                        variant="contained"
                        color="success"
                        disabled={!service.available}
                      >
                        {service.available ? 'Book Now' : 'Not Available'}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {activeTab === 'requests' && (
          <>
            <Typography variant="h5" fontWeight={600} mb={3}>My Service Requests</Typography>
            <Typography variant="body2">Service requests list goes here</Typography>
          </>
        )}

        {activeTab === 'settings' && (
          <>
            <Typography variant="h5" fontWeight={600} mb={3}>Account Settings</Typography>
            <Paper sx={{ p: 4 }}>
              <Box component="form" display="flex" flexDirection="column" gap={3}>
                <TextField label="Name" fullWidth />
                <TextField label="Email" type="email" fullWidth />
                <TextField label="Phone" type="tel" fullWidth />
                <TextField label="New Password" type="password" placeholder="Change password" fullWidth />
                <Button variant="contained" color="primary">Save Changes</Button>
              </Box>
            </Paper>
          </>
        )}
      </Box>
    </Box>
  );
};

export default UserDashboard;
