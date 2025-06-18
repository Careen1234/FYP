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
  return (
    <Box sx={{
      p: { xs: 2, md: 4 },
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
    }}>

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Service Requests
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Providing: <strong>{providerService}</strong>
      </Typography>
      <Typography variant="body2" mb={3}>
        Manage new, in-progress, and completed bookings.
      </Typography>

      <RequestTable
        icon={<AssignmentIcon />}
        title="Incoming Requests"
        data={mockIncomingRequests}
        actions={(row) => (
          <Stack direction="row" spacing={1}>
            <Button size="small" variant="contained" color="success">Accept</Button>
            <Button size="small" variant="outlined" color="error">Decline</Button>
          </Stack>
        )}
      />

      <RequestTable
        icon={<PendingActionsIcon />}
        title="In Progress"
        data={mockInProgressRequests}
        actions={() => (
          <Button size="small" variant="contained" color="primary">Mark as Completed</Button>
        )}
      />

      <RequestTable
        icon={<DoneAllIcon />}
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
  return (
    <Box mb={5}>
      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
        {icon}
        <Typography variant="h6" fontWeight="600">{title}</Typography>
      </Stack>

      <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>Customer</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.customer}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{actions(row)}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    size="small"
                    color={
                      row.status === 'New'
                        ? 'primary'
                        : row.status === 'In Progress'
                          ? 'warning'
                          : 'success'
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProviderRequests;
