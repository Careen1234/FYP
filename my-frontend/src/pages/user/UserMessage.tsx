import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Stack, Container, Paper } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import ChatIcon from '@mui/icons-material/Chat';
import PaymentIcon from '@mui/icons-material/Payment';
import ChatDialog from '../../components/ChatDialog';
import PaymentForm from '../public/PaymentForm';

const UserMessage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingDetails, provider } = location.state || {};
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  if (!bookingDetails || !provider) {
    // Redirect back if state is not available
    navigate(-1);
    return null;
  }

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  const handleCall = () => {
    if (provider?.phone) {
      window.location.href = `tel:${provider.phone}`;
    }
  };
  
  const handlePayment = () => {
    setShowPaymentForm(true);
  };


  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 4, p: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Booking Confirmed!
        </Typography>
        <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600 }}>
          Choose how you'd like to communicate
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<PhoneIcon />}
            onClick={handleCall}
          >
            Call
          </Button>
          <Button
            variant="contained"
            startIcon={<ChatIcon />}
            onClick={handleOpenChat}
          >
            Message
          </Button>
          <Button
            variant="contained"
            startIcon={<PaymentIcon />}
            onClick={handlePayment}
          >
            Payment
          </Button>
        </Stack>
      </Paper>
      <ChatDialog
        open={isChatOpen}
        onClose={handleCloseChat}
        provider={provider}
      />
      {showPaymentForm && (
        <PaymentForm
          bookingDetails={{
            providerId: provider?.id ?? null,
            serviceId: bookingDetails.service_id,
            userLocation: bookingDetails.location,
          }}
          onClose={() => setShowPaymentForm(false)}
        />
      )}
      
    </Container>
  );
};

export default UserMessage; 