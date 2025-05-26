import React, { useEffect, useState } from 'react';
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
} from '@mui/icons-material';
import axios from 'axios';

interface Activity {
  id: number;
  message: string;
}

interface CountResponse {
  count: number;
}

const Dashboard: React.FC = () => {
  // State for counts
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalProviders, setTotalProviders] = useState<number>(0);
  const [totalBookings, setTotalBookings] = useState<number>(0);
  const [latestActivities, setLatestActivities] = useState<Activity[]>([]);

  // Fetch counts and activities on component mount
useEffect(() => {
  const fetchCounts = async () => {
    try {
      const [usersRes, providersRes, bookingsRes, activityRes] = await Promise.all([
        axios.get<CountResponse>('/api/users/count'),
        axios.get<CountResponse>('/api/providers/count'),
        axios.get<CountResponse>('/api/bookings/count'),
        axios.get('/api/activity/latest'),
      ]);

      console.log('Users count:', usersRes.data);
      console.log('Providers count:', providersRes.data);
      console.log('Bookings count:', bookingsRes.data);

      setTotalUsers(usersRes.data?.count ?? 0);
      setTotalProviders(providersRes.data?.count ?? 0);
      setTotalBookings(bookingsRes.data?.count ?? 0);

      if (Array.isArray(activityRes.data)) {
        setLatestActivities(activityRes.data);
      } else {
        console.warn('Expected latest activities to be an array, got:', activityRes.data);
        setLatestActivities([]);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  fetchCounts();
}, []);


return (
    <Box component="main" sx={{ flexGrow: 1, padding: 3, backgroundColor: '#f5f5f5', minHeight: '100vh', pt: '64px' }}>
      <Header />

      <Typography variant="h5" gutterBottom>
        Dashboard Overview
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
        <Paper sx={{ p: 2, flex: '1 1 200px', minWidth: '200px' }}>
          <People sx={{ color: 'green' }} />
          <Typography variant="subtitle1">Total Users</Typography>
          <Typography variant="h6">{totalUsers}</Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: '1 1 200px', minWidth: '200px' }}>
          <Build sx={{ color: 'green' }} />
          <Typography variant="subtitle1">Service Providers</Typography>
          <Typography variant="h6">{totalProviders}</Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: '1 1 200px', minWidth: '200px' }}>
          <BookOnline sx={{ color: 'green' }} />
          <Typography variant="subtitle1">Bookings</Typography>
          <Typography variant="h6">{totalBookings}</Typography>
        </Paper>
      </Box>

      <Box sx={{ mt: 5, pb: 5 }}>
        <Typography variant="h6" gutterBottom>
          Latest Activity
        </Typography>
        <Paper sx={{ p: 2 }}>
          <List>
            {latestActivities.length === 0 && (
              <ListItem>
                <ListItemText primary="No recent activity found." />
              </ListItem>
            )}
            {latestActivities.map(activity => (
              <React.Fragment key={activity.id}>
                <ListItem>
                  <ListItemText primary={activity.message} />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;
