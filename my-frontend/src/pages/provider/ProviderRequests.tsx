import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Stack,
  useTheme
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import axios from 'axios';

const ProviderRequests: React.FC = () => {
  const theme = useTheme();
  const [requests, setRequests] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

 const fetchRequests = async () => {
  setLoading(true);
  setError('');
  try {
    // 1. Ensure CSRF cookie is set
    await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });

    // 2. Get the token (if you're using Bearer token, optional if cookie-based)
    const token = localStorage.getItem('token');

    // 3. Make the authenticated request
    const res = await axios.get('http://localhost:8000/api/provider/bookings', {
      withCredentials: true,
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    console.log('API response data:', res.data);

    if (Array.isArray(res.data)) {
      setRequests(res.data);
    } else if (
      typeof res.data === 'object' &&
      res.data !== null &&
      Array.isArray((res.data as { bookings?: unknown }).bookings)
    ) {
      setRequests((res.data as { bookings: any[] }).bookings);
    } else {
      setRequests([]);
      setError('Unexpected data format from API');
    }
  } catch (err: any) {
    console.error(err);
    setError('Failed to load requests.');
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await axios.patch(
        `http://localhost:8000/api/provider/bookings/${id}/status`,
        { status },
        { withCredentials: true }
      );
      fetchRequests();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const incomingRequests = Array.isArray(requests) ? requests.filter((r) => r.status === 'pending') : [];
const inProgressRequests = Array.isArray(requests) ? requests.filter((r) => r.status === 'approved') : [];
const completedRequests = Array.isArray(requests) ? requests.filter((r) => r.status === 'completed') : [];

  return (
    <Box sx={{ 
      p: { xs: 2, md: 3 }, 
      backgroundColor: '#f5f5f5',
      minHeight: '100vh' 
    }}>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
        <AssignmentIcon sx={{ fontSize: 30, color: '#147c3c' }} />
        <Typography variant="h5" fontWeight={600}>
          Service Requests
        </Typography>
      </Stack>

      {error && (
        <Typography color="error" mb={2}>{error}</Typography>
      )}
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
          <RequestTable
            icon={<AssignmentIcon sx={{ fontSize: 28, color: '#147c3c' }} />}
            title="Incoming Requests"
            data={incomingRequests}
            actions={(row) => (
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="contained"
                  sx={{ textTransform: 'none', backgroundColor: '#147c3c', '&:hover': { backgroundColor: '#106d32' } }}
                  onClick={() => updateStatus(row.id, 'approved')}
                >
                  Accept
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  sx={{
                    textTransform: 'none',
                    color: '#147c3c',
                    borderColor: '#147c3c',
                    '&:hover': {
                      backgroundColor: '#f0fdf4',
                      borderColor: '#106d32',
                      color: '#106d32'
                    }
                  }}
                  onClick={() => updateStatus(row.id, 'rejected')}
                >
                  Decline
                </Button>
              </Stack>
            )}
          />

          <RequestTable
            icon={<PendingActionsIcon sx={{ fontSize: 28, color: '#147c3c' }} />}
            title="In Progress"
            data={inProgressRequests}
            actions={(row) => (
              <Button
                size="small"
                variant="contained"
                sx={{ textTransform: 'none', backgroundColor: '#147c3c', '&:hover': { backgroundColor: '#106d32' } }}
                onClick={() => updateStatus(row.id, 'blocked')}
              >
                Mark as Completed
              </Button>
            )}
          />

          <RequestTable
            icon={<DoneAllIcon sx={{ fontSize: 28, color: '#147c3c' }} />}
            title="Completed Requests"
            data={completedRequests}
            actions={(_row) => null}
          />
        </>
      )}
    </Box>
  );
};

const RequestTable = ({
  icon,
  title,
  data,
  actions,
}: {
  icon: React.ReactNode,
  title: string,
  data: Array<{ id: number, customer: string, date: string, status: string }>;
  actions: (row: any) => React.ReactNode,
}) => {
  const theme = useTheme();

  return (
    <Box mb={4}>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
        {icon}
        <Typography variant="subtitle1" fontWeight={500}>{title}</Typography>
        <Chip 
          label={`${data.length} ${data.length === 1 ? 'request' : 'requests'}`} 
          size="small" 
          variant="outlined"
        />
      </Stack>

      <TableContainer 
        component={Paper} 
        sx={{ 
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: 'none'
        }}
      >
        <Table size="medium">
          <TableHead sx={{ backgroundColor: theme.palette.grey[50] }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.customer}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    size="small"
                    variant="outlined"
                    sx={{
                      color:
                        row.status === 'New'
                          ? '#147c3c'
                          : row.status === 'pending'
                          ? theme.palette.warning.main
                          : theme.palette.success.main,
                      borderColor:
                        row.status === 'New'
                          ? '#147c3c'
                          : row.status === 'pending'
                          ? theme.palette.warning.main
                          : theme.palette.success.main
                    }}
                  />
                </TableCell>
                <TableCell>{actions(row)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProviderRequests;
