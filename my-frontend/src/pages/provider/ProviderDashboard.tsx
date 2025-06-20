import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Badge from '@mui/material/Badge';
import LinearProgress from '@mui/material/LinearProgress';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
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

const ProviderDashboard = () => {
  const [isOnline, setIsOnline] = useState(true);

  const stats = {
    earnings: { current: 6500000 },
    upcomingJobs: 3,
    rating: 4.8,
    pendingRequests: 2,
    completionRate: 85,
    recentActivity: [
      { id: 1, customer: 'Alex Johnson', service: 'Pipe Repair', time: 'Today, 10:30 AM' },
      { id: 2, customer: 'Sarah Miller', service: 'Faucet Installation', time: 'Yesterday' }
    ]
  };

  const toggleAvailability = () => {
    setIsOnline(!isOnline);
  };

  const StatCard = ({ icon, title, value, subtext, progress }: { icon: React.ReactElement; title: any; value: any; subtext: any; progress?: any }) => (
    <Paper sx={{
      p: 3,
      height: '100%', // makes card fill parent Grid cell
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
            {React.isValidElement(icon)
              ? React.cloneElement(icon as React.ReactElement<any, any>, {
                  sx: { fontSize: 32, color: '#147c3c' }
                })
              : icon}
          </Box>
          <Box flex={1}>
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
      <Grid 
        container 
        spacing={3}
        sx={{ mb: 4 }}
        alignItems="stretch"
      >
        {[
          {
            icon: <EarningsIcon />,
            title: "Monthly Earnings",
            value: `Tsh ${stats.earnings.current.toLocaleString()}`,
            subtext: "This month"
          },
          {
            icon: <RatingIcon />,
            title: "Your Rating",
            value: stats.rating,
            subtext: "From 24 reviews"
          },
          {
            icon: <ScheduleIcon />,
            title: "Upcoming Jobs",
            value: stats.upcomingJobs,
            subtext: "Scheduled this week"
          },
          {
            icon: <RequestsIcon />,
            title: "Pending Requests",
            value: stats.pendingRequests,
            subtext: "Needing approval"
          }
        ].map((item, index) => (
          <Grid 
            item 
            key={index}
            xs={12} sm={6} md={3}
            sx={{ display: 'flex' }} // ensures equal height
          >
            <StatCard {...item} />
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity */}
      <Paper sx={{
        p: 3,
        transition: 'box-shadow 0.3s',
        '&:hover': {
          boxShadow: 4
        }
      }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Recent Activity
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Stack spacing={2}>
          {stats.recentActivity.map((activity) => (
            <Paper
              key={activity.id}
              variant="outlined"
              sx={{
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                '&:hover': {
                  bgcolor: '#f9f9f9'
                }
              }}
            >
              <Box>
                <Typography fontWeight={500}>{activity.customer}</Typography>
                <Typography variant="body2" color="text.secondary">{activity.service}</Typography>
              </Box>
              <Chip
                label={activity.time}
                size="small"
                variant="outlined"
              />
            </Paper>
          ))}
        </Stack>
      </Paper>

      {/* Completion Rate */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
          <StatCard
            icon={<TrendIcon />}
            title="Job Completion Rate"
            value={`${stats.completionRate}%`}
            subtext="Last 30 days"
            progress={stats.completionRate}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProviderDashboard;
