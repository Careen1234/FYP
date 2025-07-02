import React, { useState } from "react";
import {
  Button,
  Stack,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import ChatIcon from "@mui/icons-material/Chat";
import PaymentIcon from "@mui/icons-material/Payment";
import ChatDialog from "../../components/ChatDialog";
import PaymentForm from "../../pages/public/PaymentForm";
import { useLocation, useNavigate } from "react-router-dom";

const UserMessage: React.FC<any> = (props) => {
  // Accept props for provider, serviceId, userLocation, scheduledTime, notes, bookingId
  const location = useLocation();
  const navigate = useNavigate();

  // Prefer props, fallback to location.state
  const {
    provider,
    serviceId,
    userLocation,
    scheduledTime,
    notes,
    bookingId,
  } = props.provider ? props : (location.state || {});

  const [showChat, setShowChat] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const handleCall = () => {
    if (provider?.phone) {
      window.location.href = `tel:${provider.phone}`;
    }
  };

  const handleMessage = () => setShowChat(true);
  const handlePayment = () => setShowPayment(true);
  const handlePaymentSuccess = () => {
    setShowPayment(false);
    alert("Payment completed successfully.");
  };
  const handlePaymentClose = () => setShowPayment(false);

  // Always render the UI, even if some props are missing
  return (
    <Paper sx={{ p: 4, borderRadius: 3, textAlign: "center" }}>
      <Typography variant="h5" fontWeight={600} mb={3} sx={{ color: "primary.main" }}>
        Booking Confirmed {provider?.name ? `with ${provider.name}` : ""}
      </Typography>
      {scheduledTime && (
        <Typography variant="subtitle1" mb={2}>
          Scheduled for: {new Date(scheduledTime).toLocaleString()}
        </Typography>
      )}
      <Typography variant="body1" mb={3}>
        Notes: {notes || "None"}
      </Typography>

      <Stack direction="row" spacing={3} justifyContent="center" mb={4}>
        <Button variant="contained" startIcon={<PhoneIcon />} onClick={handleCall} disabled={!provider?.phone}>
          Call
        </Button>
        <Button variant="contained" startIcon={<ChatIcon />} onClick={handleMessage}>
          Message
        </Button>
        <Button variant="contained" startIcon={<PaymentIcon />} onClick={handlePayment}>
          Payment
        </Button>
      </Stack>

      <Button variant="text" onClick={() => navigate("/")} sx={{ color: "text.secondary" }}>
        ← Back to Services
      </Button>

      <ChatDialog open={showChat} onClose={() => setShowChat(false)} provider={provider} />

      <Dialog open={showPayment} onClose={handlePaymentClose} fullWidth maxWidth="sm">
        <DialogTitle>Complete Payment</DialogTitle>
        <DialogContent>
          <PaymentForm 
          bookingId={bookingId}
           onClose={handlePaymentClose}
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePaymentClose} color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default UserMessage;
