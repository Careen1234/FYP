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
  Select,
  MenuItem,
  IconButton,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

interface Booking {
  id: number;
  user_name: string;
  provider_name: string;
  service_name: string;
  booking_date: string;
  status: string;
}

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/bookings');
      setBookings((res.data as { data: Booking[] }).data);
    } catch (err) {
      console.error('Error fetching bookings', err);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await axios.put(`http://localhost:8000/api/bookings/${id}`, {
        status: newStatus,
      });
      fetchBookings();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/bookings/${id}`);
      fetchBookings();
    } catch (err) {
      console.error('Error deleting booking', err);
    }
  };

  return (
    <Box p={5}>
      <Typography variant="h5"  sx={{ color: '#2E7D32', mb: 2 }}gutterBottom>
        Booking Management
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead  sx={{ backgroundColor: '#2E7D32' }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Provider</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Booking Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>
                <TableCell>{booking.user_name}</TableCell>
                <TableCell>{booking.provider_name}</TableCell>
                <TableCell>{booking.service_name}</TableCell>
                <TableCell>{new Date(booking.booking_date).toLocaleString()}</TableCell>
                <TableCell>
                  <Select
                    value={booking.status}
                    onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                    size="small"
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="confirmed">Confirmed</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDelete(booking.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>

    
  );
};

export default BookingManagement;
