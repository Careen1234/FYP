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
      
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8000/api/provider/bookings', {
        withCredentials: true,
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      setRequests(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
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
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:8000/api/bookings/${id}/status`,
        { status },
        {
          withCredentials: true,
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        }
      );
      fetchRequests();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const incomingRequests = requests.filter((r) => r.status === 'pending');
  const inProgressRequests = requests.filter((r) => r.status === 'accepted');
  const completedRequests = requests.filter((r) => r.status === 'completed');

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        backgroundColor: '#f0f4f8',
        minHeight: '100vh',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        mb={3}
        sx={{
          backgroundColor: '#fff',
          p: 2,
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <AssignmentIcon sx={{ fontSize: 30, color: '#147c3c' }} />
        <Typography variant="h5" fontWeight={700} color="#0f172a">
          Service Requests
        </Typography>
      </Stack>

      {error && (
        <Typography
          color="error"
          mb={2}
          sx={{
            backgroundColor: '#fff0f0',
            border: '1px solid #fca5a5',
            borderRadius: 1,
            p: 2,
          }}
        >
          {error}
        </Typography>
      )}

      {loading ? (
        <Typography fontSize="1rem" fontWeight={500} color="#64748b">
          Loading...
        </Typography>
      ) : (
        <>
          <RequestTable
            icon={<AssignmentIcon sx={{ fontSize: 26, color: '#147c3c' }} />}
            title="Incoming Requests"
            data={incomingRequests}
            actions={(row) => (
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="contained"
                  sx={{
                    textTransform: 'none',
                    backgroundColor: '#147c3c',
                    fontWeight: 600,
                    borderRadius: 2,
                    boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
                  }}
                  onClick={() => updateStatus(row.id, 'accepted')}
                >
                  Accept
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    color: '#147c3c',
                    borderColor: '#147c3c',
                    '&:hover': {
                      backgroundColor: '#ecfdf5',
                      borderColor: '#106d32',
                      color: '#106d32',
                    },
                  }}
                  onClick={() => updateStatus(row.id, 'rejected')}
                >
                  Reject
                </Button>
              </Stack>
            )}
          />

          <RequestTable
            icon={<PendingActionsIcon sx={{ fontSize: 26, color: '#147c3c' }} />}
            title="In Progress"
            data={inProgressRequests}
            actions={(row) => (
              <Button
                size="small"
                variant="contained"
                sx={{
                  textTransform: 'none',
                  backgroundColor: '#147c3c',
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
                }}
                onClick={() => updateStatus(row.id, 'completed')}
              >
                Mark as Completed
              </Button>
            )}
          />

          <RequestTable
            icon={<DoneAllIcon sx={{ fontSize: 26, color: '#147c3c' }} />}
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
  data: Array<any>,
  actions: (row: any) => React.ReactNode,
}) => {
  const theme = useTheme();

  const getChipColor = (status: string) => {
    switch (status) {
      case 'pending': return theme.palette.warning.main;
      case 'accepted': return theme.palette.info.main;
      case 'rejected': return theme.palette.error.main;
      case 'completed': return theme.palette.success.main;
      default: return theme.palette.grey[500];
    }
  };

  return (
    <Box mb={4}>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
        {icon}
        <Typography variant="subtitle1" fontWeight={600}>
          {title}
        </Typography>
        <Chip
          label={`${data.length} ${data.length === 1 ? 'request' : 'requests'}`}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 500 }}
        />
      </Stack>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        <Table size="medium">
          <TableHead sx={{ backgroundColor: '#f1f5f9' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#0f172a' }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#0f172a' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#0f172a' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#0f172a' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.id}
                hover
                sx={{
                  transition: 'background 0.2s',
                  '&:hover': {
                    backgroundColor: '#f9fafb',
                  },
                }}
              >
                <TableCell>{row.customer ?? ''}</TableCell>
                <TableCell>{row.date ?? ''}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    size="small"
                    variant="outlined"
                    sx={{
                      color: getChipColor(row.status),
                      borderColor: getChipColor(row.status),
                      fontWeight: 500,
                      textTransform: 'capitalize',
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
