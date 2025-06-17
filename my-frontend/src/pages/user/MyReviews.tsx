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

interface Rating {
  id: number;
  user_name: string;
  provider_name: string;
  service_name: string;
  rating: string;
  reviews: number;
}

interface ApiResponse {
  data: Rating[];
}

const MyReviews: React.FC = () => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await axios.get<ApiResponse>(
          "http://localhost:8000/api/ratings",
          { withCredentials: true }
        );

        // Now TypeScript knows that `res.data.data` exists and is Booking[]
        if (Array.isArray(res.data.data)) {
          setRatings(res.data.data);
        } else {
          console.error("Unexpected response structure:", res.data);
          setError("Unexpected response format.");
        }
      } catch (err) {
        console.error("Error fetching ratings:", err);
        setError("Failed to load your rating requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
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
        My Reviews
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Provider</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Review</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ratings.map((rating) => (
              <TableRow key={rating.id}>
                <TableCell>{rating.id}</TableCell>
                <TableCell>{rating.user_name}</TableCell>
                <TableCell>{rating.provider_name}</TableCell>
                <TableCell>{rating.service_name}</TableCell>
                <TableCell>{rating.rating}</TableCell>
                <TableCell>{rating.reviews}</TableCell>
              </TableRow>
            ))}
            {ratings.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No ratings requests found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MyReviews;
function setRatings(data: Rating[]) {
  throw new Error("Function not implemented.");
}
