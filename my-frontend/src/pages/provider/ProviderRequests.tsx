import React from 'react';
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

const providerService = "Plumbing Service";

const mockIncomingRequests = [
  { id: 1, customer: 'John Doe', date: '2025-06-18', status: 'New' },
  { id: 2, customer: 'Jane Smith', date: '2025-06-17', status: 'New' },
];

const mockInProgressRequests = [
  { id: 3, customer: 'Charlie Green', date: '2025-06-16', status: 'In Progress' },
];

const mockCompletedRequests = [
  { id: 4, customer: 'Alice Brown', date: '2025-06-15', status: 'Completed' },
  { id: 5, customer: 'Bob White', date: '2025-06-12', status: 'Completed' },
];

const ProviderRequests: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ 
      p: { xs: 2, md: 3 }, 
      backgroundColor: '#f5f5f5', // light gray
      minHeight: '100vh' 
    }}>
      {/* Header with Icon */}
      <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
        <AssignmentIcon sx={{ fontSize: 30, color: '#147c3c' }} />
        <Typography variant="h5" fontWeight={600}>
          Service Requests
        </Typography>
      </Stack>

      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Providing: {providerService}
      </Typography>

      <RequestTable
        icon={<AssignmentIcon sx={{ fontSize: 28, color: '#147c3c' }} />}
        title="Incoming Requests"
        data={mockIncomingRequests}
        actions={(row) => (
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="contained"
              sx={{ textTransform: 'none', backgroundColor: '#147c3c', '&:hover': { backgroundColor: '#106d32' } }}
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
            >
              Decline
            </Button>
          </Stack>
        )}
      />

      <RequestTable
        icon={<PendingActionsIcon sx={{ fontSize: 28, color: '#147c3c' }} />}
        title="In Progress"
        data={mockInProgressRequests}
        actions={() => (
          <Button
            size="small"
            variant="contained"
            sx={{ textTransform: 'none', backgroundColor: '#147c3c', '&:hover': { backgroundColor: '#106d32' } }}
          >
            Mark as Completed
          </Button>
        )}
      />

      <RequestTable
        icon={<DoneAllIcon sx={{ fontSize: 28, color: '#147c3c' }} />}
        title="Completed Requests"
        data={mockCompletedRequests}
        actions={(_row) => null}
      />
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
  data: Array<{ id: number, customer: string, date: string, status: string }>,
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
                          : row.status === 'In Progress'
                          ? theme.palette.warning.main
                          : theme.palette.success.main,
                      borderColor:
                        row.status === 'New'
                          ? '#147c3c'
                          : row.status === 'In Progress'
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
