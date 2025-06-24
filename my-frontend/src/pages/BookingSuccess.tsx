// src/pages/BookingSuccess.tsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BookingSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h4" gutterBottom color="green">
        🎉 Booking Confirmed!
      </Typography>
      <Typography variant="body1" mb={3}>
        Thank you for your booking. Your provider will reach out shortly.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/dashboard')}>
        Go to Dashboard
      </Button>
    </Box>
  );
};

export default BookingSuccess;
