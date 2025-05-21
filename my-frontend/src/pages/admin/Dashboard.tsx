import React from 'react';
import Header from '../../components/admin/Header';
import {
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  People,
  Build,
  BookOnline,
  Payment,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const chartData = [
  { name: 'Jan', bookings: 30 },
  { name: 'Feb', bookings: 45 },
  { name: 'Mar', bookings: 25 },
  { name: 'Apr', bookings: 60 },
];

const Dashboard: React.FC = () => {
  return (
    <Box component="main" sx={{ flexGrow: 1, padding: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' ,  pt: '64px',  }}>
      <Header />

      <Typography variant="h5" gutterBottom>
        Dashboard Overview
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
        <Paper sx={{ p: 2, flex: '1 1 200px', minWidth: '200px' }}>
          <People color="primary" />
          <Typography variant="subtitle1">Total Users</Typography>
          <Typography variant="h6">1,230</Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: '1 1 200px', minWidth: '200px' }}>
          <Build color="primary" />
          <Typography variant="subtitle1">Service Providers</Typography>
          <Typography variant="h6">340</Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: '1 1 200px', minWidth: '200px' }}>
          <BookOnline color="primary" />
          <Typography variant="subtitle1">Bookings</Typography>
          <Typography variant="h6">1,050</Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: '1 1 200px', minWidth: '200px' }}>
          <Payment color="primary" />
          <Typography variant="subtitle1">Revenue</Typography>
          <Typography variant="h6">$23,400</Typography>
        </Paper>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" gutterBottom>
          Booking Trends
        </Typography>
        <Paper sx={{ p: 2 }}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#4caf50" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      <Box sx={{ mt: 5, pb: 5 }}>
        <Typography variant="h6" gutterBottom>
          Latest Activity
        </Typography>
        <Paper sx={{ p: 2 }}>
          <List>
            <ListItem>
              <ListItemText primary="User John Doe booked Cleaning Service" />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText primary="Provider Sarah accepted a Plumbing request" />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText primary="New user registered: Jane Smith" />
            </ListItem>
          </List>
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;
