import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Switch,
  FormControlLabel,
  Badge,
  LinearProgress,
  Divider,
  Avatar
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Dashboard as DashboardIcon,
  CheckCircle as OnlineIcon,
  Cancel as OfflineIcon,
  MonetizationOn as EarningsIcon,
  Schedule as ScheduleIcon,
  Star as RatingIcon,
  Assignment as RequestsIcon,
  TrendingUp as TrendIcon
} from '@mui/icons-material';
import axios from 'axios';

const recentActivity = [
  { id: 1, customer: 'Alex Johnson', service: 'Pipe Repair', time: 'Today, 10:30 AM' },
  { id: 2, customer: 'Sarah Miller', service: 'Faucet Installation', time: 'Yesterday' }
];

const ProviderDashboard = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [dashboardData, setDashboardData] = useState<{
    monthly_earnings: number;
    rating: number;
    pending_requests: number;
    upcoming_jobs: number;
    completion_rate: number;
  } | null>(null);

  useEffect(() => {
    axios.get<{
      monthly_earnings: number;
      rating: number;
      pending_requests: number;
      upcoming_jobs: number;
      completion_rate: number;
    }>('/api/provider/dashboard')
      .then(res => setDashboardData(res.data))
      .catch(err => console.error('Failed to fetch dashboard data', err));
  }, []);

  const toggleAvailability = () => {
    setIsOnline(!isOnline);
  };

  const StatCard = ({ icon, title, value, subtext, progress }: {
    icon: React.ReactElement;
    title: string;
    value: string | number;
    subtext?: string;
    progress?: number;
  }) => (
    <Paper sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      p: 3,
      borderRadius: 4,
      background: 'linear-gradient(135deg, #fff 60%, #eafaf1 100%)',
      boxShadow: '0 6px 24px rgba(20,124,60,0.08)',
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-8px) scale(1.03)',
        boxShadow: '0 12px 32px rgba(20,124,60,0.18)'
      },
      border: '1.5px solid #e0f2e9',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: '#eafaf1',
          boxShadow: '0 2px 8px rgba(20,124,60,0.07)'
        }}>
          {icon}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" color="#147c3c" fontWeight={600} noWrap>
            {title}
          </Typography>
          <Typography
            variant="h4"
            fontWeight={800}
            color="#147c3c"
            sx={{ wordBreak: 'break-word', fontSize: 24 }}
          >
            {value}
          </Typography>
        </Box>
      </Stack>

      {subtext && (
        <Typography variant="caption" color="#147c3c" fontWeight={500} sx={{ mt: 'auto' }}>
          {subtext}
        </Typography>
      )}

      {progress !== undefined && (
        <Box mt={2}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 7,
              borderRadius: 3,
              backgroundColor: '#eafaf1',
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                backgroundColor: '#147c3c'
              }
            }}
          />
        </Box>
      )}
    </Paper>
  );

  const stats = dashboardData ? [
    {
      icon: <EarningsIcon sx={{ fontSize: 32, color: '#147c3c' }} />,
      title: "Monthly Earnings",
      value: `Tsh ${Number(dashboardData?.monthly_earnings || 0).toLocaleString()}`,
      subtext: "This month"
    },
    {
      icon: <RatingIcon sx={{ fontSize: 32, color: '#147c3c' }} />,
      title: "Your Rating",
      value: dashboardData.rating,
      subtext: "Based on customer reviews"
    },
    {
      icon: <RequestsIcon sx={{ fontSize: 32, color: '#147c3c' }} />,
      title: "Pending Requests",
      value: dashboardData.pending_requests,
      subtext: "Action needed"
    },
    {
      icon: <ScheduleIcon sx={{ fontSize: 32, color: '#147c3c' }} />,
      title: "Upcoming Jobs",
      value: dashboardData.upcoming_jobs,
      subtext: "Scheduled this week"
    },
    {
      icon: <TrendIcon sx={{ fontSize: 32, color: '#147c3c' }} />,
      title: "Completion Rate",
      value: `${dashboardData.completion_rate}%`,
      subtext: "All time",
      progress: dashboardData.completion_rate
    }
  ] : [];

  return (
    <Box sx={{
      px: 2,
      py: 4,
      background: 'linear-gradient(120deg, #eafaf1 0%, #fff 100%)',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <Box sx={{ width: '100%', maxWidth: '1200px' }}>
        {/* Header */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
          mb={4}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{
              background: '#147c3c',
              borderRadius: '50%',
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(20,124,60,0.13)'
            }}>
              <DashboardIcon sx={{ fontSize: 32, color: '#fff' }} />
            </Box>
            <Typography variant="h5" fontWeight={800} color="#147c3c">
              Dashboard Overview
            </Typography>
          </Stack>

          <FormControlLabel
            control={
              <Switch
                checked={isOnline}
                onChange={toggleAvailability}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#147c3c',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#147c3c',
                  },
                  '& .MuiSwitch-track': {
                    backgroundColor: '#eafaf1',
                  },
                }}
                size="medium"
              />
            }
            label={
              <Badge
                badgeContent={isOnline ? 'Online' : 'Offline'}
                color={isOnline ? 'success' : 'error'}
                sx={{
                  '& .MuiBadge-badge': {
                    right: -10,
                    top: 10,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    background: isOnline ? '#147c3c' : '#d32f2f',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 13
                  }
                }}
              />
            }
            labelPlacement="start"
            sx={{
              ml: 0,
              '& .MuiTypography-root': {
                fontWeight: 700,
                color: isOnline ? '#147c3c' : '#d32f2f',
                fontSize: 16
              }
            }}
          />
        </Stack>

        {/* Status Indicator */}
        <Paper sx={{
          p: 2.5,
          mb: 4,
          bgcolor: isOnline ? '#eafaf1' : '#fddede',
          borderLeft: `5px solid ${isOnline ? '#147c3c' : '#d32f2f'}`,
          borderRadius: 3,
          boxShadow: '0 2px 12px rgba(20,124,60,0.07)'
        }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            {isOnline ? (
              <OnlineIcon sx={{ color: '#147c3c', fontSize: 32 }} />
            ) : (
              <OfflineIcon sx={{ color: '#d32f2f', fontSize: 32 }} />
            )}
            <Typography variant="body1" fontWeight={700} color={isOnline ? '#147c3c' : '#d32f2f'}>
              You are currently <span style={{
                color: isOnline ? '#147c3c' : '#d32f2f',
                fontWeight: 800
              }}>
                {isOnline ? 'AVAILABLE' : 'NOT AVAILABLE'}
              </span> for new service requests
            </Typography>
          </Stack>
        </Paper>

        {/* Stats Cards */}
        {!dashboardData ? (
          <Typography>Loading dashboard...</Typography>
        ) : (
          <Grid container spacing={3} mb={5}>
            {stats.map((stat, idx) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={idx}>
                <StatCard {...stat} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Recent Activity */}
        <Paper sx={{ p: 3.5, borderRadius: 4, boxShadow: '0 4px 18px rgba(20,124,60,0.08)', background: '#fff' }}>
          <Typography variant="h6" fontWeight={800} mb={2} color="#147c3c">
            Recent Activity
          </Typography>
          <Divider sx={{ mb: 2, borderColor: '#e0f2e9' }} />
          <Stack spacing={2}>
            {recentActivity.map((activity) => (
              <Box key={activity.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#147c3c', width: 48, height: 48, fontWeight: 700, fontSize: 22, boxShadow: '0 2px 8px rgba(20,124,60,0.13)' }}>
                  {activity.customer.charAt(0)}
                </Avatar>
                <Box>
                  <Typography fontWeight={700} color="#147c3c">{activity.customer}</Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    {activity.service} &mdash; {activity.time}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default ProviderDashboard;
