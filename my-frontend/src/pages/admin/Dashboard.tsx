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
  Stack,
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

interface StatCardProps {
  icon: React.ReactElement;
  title: string;
  value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value }) => (
  <Paper
    sx={{
      p: 3,
      borderRadius: 4,
      background: 'linear-gradient(135deg, #fff 60%, #eafaf1 100%)',
      boxShadow: '0 6px 24px rgba(20,124,60,0.08)',
      transition: 'transform 0.3s, box-shadow 0.3s',
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      cursor: 'default',
      '&:hover': {
        transform: 'translateY(-8px) scale(1.03)',
        boxShadow: '0 12px 32px rgba(20,124,60,0.18)',
      },
    }}
  >
    <Box
      sx={{
        background: '#eafaf1',
        borderRadius: '50%',
        width: 56,
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(20,124,60,0.07)',
        color: '#147c3c',
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography variant="subtitle2" color="#147c3c" fontWeight={600}>
        {title}
      </Typography>
      <Typography variant="h4" color="#147c3c" fontWeight={800}>
        {value}
      </Typography>
    </Box>
  </Paper>
);

const Dashboard: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalProviders, setTotalProviders] = useState<number>(0);
  const [totalBookings, setTotalBookings] = useState<number>(0);
  const [latestActivities, setLatestActivities] = useState<Activity[]>([]);

  interface DashboardData {
    total_users: number;
    total_providers: number;
    total_bookings: number;
    latest_activities: Activity[];
  }

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get('/api/admin/dashboard');
        const data = res.data as DashboardData;

        setTotalUsers(data?.total_users ?? 0);
        setTotalProviders(data?.total_providers ?? 0);
        setTotalBookings(data?.total_bookings ?? 0);
        setLatestActivities(Array.isArray(data.latest_activities) ? data.latest_activities : []);
      } catch (error) {
        console.error('Failed to fetch admin dashboard data:', error);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        padding: 3,
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        pt: '64px',
      }}
    >
      <Header />

     <Typography
  variant="subtitle2"
  sx={{ color: '#147c3c', mb: 2, fontWeight: 600, fontSize: '1.25rem' }}
>
  DASHBOARD OVERVIEW
</Typography>


      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 3,
          mb: 4,
        }}
      >
        <StatCard icon={<People sx={{ fontSize: 32 }} />} title="Total Users" value={totalUsers} />
        <StatCard icon={<Build sx={{ fontSize: 32 }} />} title="Service Providers" value={totalProviders} />
        <StatCard icon={<BookOnline sx={{ fontSize: 32 }} />} title="Bookings" value={totalBookings} />
      </Box>

      <Box sx={{ mt: 5, pb: 5 }}>
          <Typography
  variant="subtitle2"
  sx={{ color: '#147c3c', mb: 2, fontWeight: 600, fontSize: '1.25rem' }}
>
  LATEST ACTIVITIES
</Typography>
        <Paper sx={{ p: 2 }}>
          <List>
            {latestActivities.length === 0 && (
              <ListItem>
                <ListItemText primary="No recent activity found." />
              </ListItem>
            )}
            {latestActivities.map((activity) => (
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
