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
  Avatar,
  Grid,
  Skeleton,
  Chip
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  CheckCircle as OnlineIcon,
  Cancel as OfflineIcon,
  MonetizationOn as EarningsIcon,
  Schedule as ScheduleIcon,
  Star as RatingIcon,
  Assignment as RequestsIcon,
  TrendingUp as TrendIcon,
  People as PeopleIcon,
  NotificationsActive as AlertIcon
} from '@mui/icons-material';
import axios from 'axios';

const ProviderDashboard = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [dashboardData, setDashboardData] = useState<{
    monthly_earnings: number;
    rating: number;
    pending_requests: number;
    upcoming_jobs: number;
    completion_rate: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    // Fetch dashboard data
    axios.get('/api/provider/dashboard')
      .then(res => {
        setDashboardData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch dashboard data', err);
        setLoading(false);
      });
    
    // Fetch recent activity
    axios.get('/api/provider/recent-activity')
      .then(res => {
        setRecentActivity(res.data);
      })
      .catch(err => {
        console.error('Failed to fetch recent activity', err);
      });
  }, []);

  const toggleAvailability = () => {
    setIsOnline(!isOnline);
    // Send availability status to backend
    axios.post('/api/provider/availability', { is_online: !isOnline });
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
      borderRadius: 3,
      backgroundColor: '#fff',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.03)',
      border: '1px solid #e2e8f0',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)',
        borderColor: '#147c3c'
      },
    }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 56,
          height: 56,
          borderRadius: '14px',
          background: '#f0fdf4',
          color: '#147c3c'
        }}>
          {icon}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" color="#64748b" fontWeight={500} noWrap>
            {title}
          </Typography>
          {loading ? (
            <Skeleton variant="text" width="60%" height={40} />
          ) : (
            <Typography
              variant="h5"
              fontWeight={700}
              color="#0d5a2c"
              sx={{ fontSize: 24 }}
            >
              {value}
            </Typography>
          )}
        </Box>
      </Stack>

      {subtext && (
        <Typography variant="body2" color="#94a3b8" sx={{ mt: 'auto' }}>
          {subtext}
        </Typography>
      )}

      {progress !== undefined && (
        <Box mt={2}>
          {loading ? (
            <Skeleton variant="rectangular" height={8} sx={{ borderRadius: 4 }} />
          ) : (
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: '#f1f5f9',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  backgroundColor: '#147c3c'
                }
              }}
            />
          )}
        </Box>
      )}
    </Paper>
  );

  const stats = dashboardData ? [
    {
      icon: <EarningsIcon sx={{ fontSize: 28, color: '#147c3c' }} />,
      title: "Monthly Earnings",
      value: `Tsh ${Number(dashboardData?.monthly_earnings || 0).toLocaleString()}`,
      subtext: "This month"
    },
    {
      icon: <RatingIcon sx={{ fontSize: 28, color: '#147c3c' }} />,
      title: "Your Rating",
      value: dashboardData.rating,
      subtext: "Based on customer reviews"
    },
    {
      icon: <RequestsIcon sx={{ fontSize: 28, color: '#147c3c' }} />,
      title: "Pending Requests",
      value: dashboardData.pending_requests,
      subtext: "Action needed"
    },
    {
      icon: <ScheduleIcon sx={{ fontSize: 28, color: '#147c3c' }} />,
      title: "Upcoming Jobs",
      value: dashboardData.upcoming_jobs,
      subtext: "Scheduled this week"
    },
    {
      icon: <TrendIcon sx={{ fontSize: 28, color: '#147c3c' }} />,
      title: "Completion Rate",
      value: `${dashboardData.completion_rate}%`,
      subtext: "All time",
      progress: dashboardData.completion_rate
    }
  ] : [];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'warning';
      case 'completed': return 'success';
      case 'in-progress': return 'info';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'pending': return 'Pending';
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      default: return status;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
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
            borderRadius: '14px',
            width: 48,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <DashboardIcon sx={{ fontSize: 28, color: '#fff' }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={700} color="#0d5a2c">
              Dashboard Overview
            </Typography>
            <Typography variant="body2" color="#64748b">
              Track your performance and recent activity
            </Typography>
          </Box>
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
                  borderRadius: 12,
                  background: isOnline ? '#147c3c' : '#ef4444',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 12
                }
              }}
            />
          }
          labelPlacement="start"
          sx={{
            ml: 0,
            '& .MuiTypography-root': {
              fontWeight: 600,
              color: isOnline ? '#147c3c' : '#ef4444',
              fontSize: 14
            }
          }}
        />
      </Stack>

      {/* Status Indicator */}
      <Paper sx={{
        p: 3,
        mb: 4,
        backgroundColor: isOnline ? '#f0fdf4' : '#fef2f2',
        borderLeft: `4px solid ${isOnline ? '#147c3c' : '#ef4444'}`,
        borderRadius: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        {isOnline ? (
          <OnlineIcon sx={{ color: '#147c3c', fontSize: 32 }} />
        ) : (
          <OfflineIcon sx={{ color: '#ef4444', fontSize: 32 }} />
        )}
        <Box>
          <Typography variant="body1" fontWeight={600} color={isOnline ? '#0d5a2c' : '#b91c1c'}>
            Service Availability
          </Typography>
          <Typography variant="body2" color={isOnline ? '#64748b' : '#ef4444'}>
            You are currently <span style={{ fontWeight: 700 }}>{isOnline ? 'available' : 'not available'}</span> for new service requests
          </Typography>
        </Box>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {stats.map((stat, idx) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={idx}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.03)', border: '1px solid #e2e8f0' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight={700} color="#0d5a2c">
                Recent Activity
              </Typography>
              {recentActivity.length > 0 && (
                <Chip 
                  label={`${recentActivity.length} new`} 
                  size="small" 
                  sx={{ backgroundColor: '#f0fdf4', color: '#147c3c', fontWeight: 500 }} 
                />
              )}
            </Stack>
            <Divider sx={{ mb: 3, borderColor: '#e2e8f0' }} />
            
            {loading ? (
              <Box>
                {[0, 1, 2].map((i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Skeleton variant="circular" width={48} height={48} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="60%" height={24} />
                      <Skeleton variant="text" width="40%" height={20} />
                      <Skeleton variant="text" width="30%" height={16} />
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : recentActivity.length > 0 ? (
              <Stack spacing={3}>
                {recentActivity.map((activity) => (
                  <Box key={activity.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Avatar sx={{ 
                      bgcolor: '#f0fdf4', 
                      width: 48, 
                      height: 48, 
                      fontWeight: 600, 
                      fontSize: 18,
                      color: '#147c3c',
                      border: '1px solid #e2e8f0'
                    }}>
                      {activity.customer?.charAt(0) || 'C'}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Typography fontWeight={600} color="#0d5a2c">
                          {activity.customer || 'Customer'}
                        </Typography>
                        <Chip 
                          label={getStatusText(activity.status)} 
                          size="small" 
                          color={getStatusColor(activity.status)} 
                          sx={{ fontWeight: 500 }} 
                        />
                      </Stack>
                      <Typography variant="body2" fontWeight={500} color="#334155" mt={0.5}>
                        {activity.service || 'Service'}
                      </Typography>
                      <Typography variant="body2" color="#94a3b8" mt={1} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ScheduleIcon sx={{ fontSize: 16 }} />
                        {activity.time || 'Recently'}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="#64748b">
                  No recent activity
                </Typography>
                <Typography variant="body2" color="#94a3b8" mt={1}>
                  Your recent service requests will appear here
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Performance Tips */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3, 
            height: '100%', 
            background: 'linear-gradient(135deg, #147c3c 0%, #0d5a2c 100%)',
            color: 'white',
            boxShadow: '0 10px 25px rgba(20, 124, 60, 0.3)'
          }}>
            <Stack direction="row" alignItems="center" gap={1.5} mb={3}>
              <AlertIcon sx={{ fontSize: 28 }} />
              <Typography variant="h6" fontWeight={700}>
                Performance Tips
              </Typography>
            </Stack>
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', mb: 3 }} />
            
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  mt: 0.5
                }}>
                  <Typography variant="body2" fontWeight={700}>1</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                    Respond Quickly
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Providers who respond within 30 minutes get 40% more bookings.
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  mt: 0.5
                }}>
                  <Typography variant="body2" fontWeight={700}>2</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                    Complete Your Profile
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Providers with complete profiles get 50% more customer trust.
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  mt: 0.5
                }}>
                  <Typography variant="body2" fontWeight={700}>3</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                    Request Reviews
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    A 5-star rating can increase your bookings by up to 30%.
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProviderDashboard;