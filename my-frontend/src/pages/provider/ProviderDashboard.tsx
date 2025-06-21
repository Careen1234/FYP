import React, { useState } from 'react';
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
  Chip,
  Avatar
} from '@mui/material';
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

const recentActivity = [
  { id: 1, customer: 'Alex Johnson', service: 'Pipe Repair', time: 'Today, 10:30 AM' },
  { id: 2, customer: 'Sarah Miller', service: 'Faucet Installation', time: 'Yesterday' }
];

const ProviderDashboard = () => {
  const [isOnline, setIsOnline] = useState(true);

  const stats = [
    {
      icon: <EarningsIcon sx={{ fontSize: 32, color: '#147c3c' }} />,
      title: "Monthly Earnings",
      value: `Tsh ${6500000..toLocaleString()}`,
      subtext: "This month"
    },
    {
      icon: <RatingIcon sx={{ fontSize: 32, color: '#147c3c' }} />,
      title: "Your Rating",
      value: 4.8,
      subtext: "Based on customer reviews"
    },
    {
      icon: <RequestsIcon sx={{ fontSize: 32, color: '#147c3c' }} />,
      title: "Pending Requests",
      value: 2,
      subtext: "Action needed"
    },
    {
      icon: <ScheduleIcon sx={{ fontSize: 32, color: '#147c3c' }} />,
      title: "Upcoming Jobs",
      value: 3,
      subtext: "Scheduled this week"
    },
    {
      icon: <TrendIcon sx={{ fontSize: 32, color: '#147c3c' }} />,
      title: "Completion Rate",
      value: `85%`,
      subtext: "All time",
      progress: 85
    }
  ];

  const toggleAvailability = () => {
    setIsOnline(!isOnline);
  };

  const StatCard = ({ icon, title, value, subtext, progress }: {
    icon: React.ReactElement;
    title: any;
    value: any;
    subtext: any;
    progress?: number;
  }) => (
    <Paper sx={{
      p: 3,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
      }
    }}>
      <Box>
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48
          }}>
            {icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
            <Typography variant="h4" fontWeight={700}>{value}</Typography>
          </Box>
        </Stack>
      </Box>

      {subtext && (
        <Typography variant="caption" color="text.secondary">{subtext}</Typography>
      )}

      {progress !== undefined && (
        <Box mt={2}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: '#eee',
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

  return (
    <Box sx={{
      p: { xs: 2, md: 3 },
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
        mb={4}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <DashboardIcon sx={{ fontSize: 32, color: '#147c3c' }} />
          <Typography variant="h5" fontWeight={600}>
            Dashboard Overview
          </Typography>
        </Stack>

        <FormControlLabel
          control={
            <Switch
              checked={isOnline}
              onChange={toggleAvailability}
              color="success"
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
                  borderRadius: 2
                }
              }}
            />
          }
          labelPlacement="start"
          sx={{
            ml: 0,
            '& .MuiTypography-root': {
              fontWeight: 600,
              color: isOnline ? '#147c3c' : '#d32f2f'
            }
          }}
        />
      </Stack>

      {/* Status Indicator */}
      <Paper sx={{
        p: 2,
        mb: 3,
        bgcolor: isOnline ? '#d0f2df' : '#fddede',
        borderLeft: `4px solid ${isOnline ? '#147c3c' : '#d32f2f'}`
      }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          {isOnline ? (
            <OnlineIcon sx={{ color: '#147c3c', fontSize: 28 }} />
          ) : (
            <OfflineIcon sx={{ color: '#d32f2f', fontSize: 28 }} />
          )}
          <Typography variant="body1" fontWeight={500}>
            You are currently <span style={{
              color: isOnline ? '#147c3c' : '#d32f2f',
              fontWeight: 600
            }}>
              {isOnline ? 'AVAILABLE' : 'NOT AVAILABLE'}
            </span> for new service requests
          </Typography>
        </Stack>
      </Paper>

      {/* Stats Cards */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          mb: 4,
          alignItems: 'stretch',
        }}
      >
        {stats.map((stat, idx) => (
          <Box key={idx} sx={{ flex: '1 1 260px', minWidth: 260, maxWidth: 340, display: 'flex' }}>
            <StatCard {...stat} />
          </Box>
        ))}
      </Box>

      {/* Recent Activity */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Recent Activity
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={2}>
          {recentActivity.map((activity) => (
            <Box key={activity.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#147c3c', width: 40, height: 40 }}>
                {activity.customer.charAt(0)}
              </Avatar>
              <Box>
                <Typography fontWeight={600}>{activity.customer}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {activity.service} &mdash; {activity.time}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
};

export default ProviderDashboard;
