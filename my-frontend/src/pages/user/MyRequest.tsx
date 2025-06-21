import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

interface Booking {
  id: number;
  user_name: string;
  provider_name: string;
  service_name: string;
  status: string;
  address: number;
  is_paid: boolean;
  booking_date: string;
}

interface ApiResponse {
  data: Booking[];
}

const MyRequest: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get<ApiResponse>(
          "http://localhost:8000/api/bookings",
          { withCredentials: true }
        );

        // Now TypeScript knows that `res.data.data` exists and is Booking[]
        if (Array.isArray(res.data.data)) {
          setBookings(res.data.data);
        } else {
          console.error("Unexpected response structure:", res.data);
          setError("Unexpected response format.");
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load your booking requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        My Booking Requests
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Provider</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Booking Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>
                <TableCell>{booking.user_name}</TableCell>
                <TableCell>{booking.provider_name}</TableCell>
                <TableCell>{booking.service_name}</TableCell>
                <TableCell>{(() => {
                  switch (booking.status) {
                    case "pending":
                      return "Pending";
                    case "approved":
                      return "Approved";
                    case "blocked":
                      return "Blocked";
                    default:
                      return booking.status;
                  }
                })()}</TableCell>
                <TableCell>{booking.is_paid ? "Paid" : "Pending"}</TableCell>
                <TableCell>
                  {new Date(booking.booking_date).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {bookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No booking requests found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MyRequest;
