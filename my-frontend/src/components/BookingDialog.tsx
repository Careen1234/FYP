import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Stack,
  useTheme,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import ChatIcon from "@mui/icons-material/Chat";
import PaymentIcon from "@mui/icons-material/Payment";
import ChatDialog from "./ChatDialog";

import PaymentForm from "../pages/Payment"; // Adjust the import path as necessary

interface BookingDialogProps {
  open: boolean;
  onClose: () => void;
  provider: {
    id: number;
    name: string;
    phone: string;
  } | null;
  serviceId: number | null;
  userLocation: { lat: number; lng: number } | null;
  onConfirm: (details: {
    scheduled_time: string;
    notes: string;
    communication: string;
  }) => void;
}

const communicationOptions = [
  { label: "Call", icon: <PhoneIcon /> },
  { label: "Message", icon: <ChatIcon /> },
  { label: "Payment", icon: <PaymentIcon /> },
];

const BookingDialog: React.FC<BookingDialogProps> = ({
  open,
  onClose,
  provider,
  serviceId,
  userLocation,
  onConfirm,
}) => {
  const theme = useTheme();
  const [scheduledTime, setScheduledTime] = useState("");
  const [notes, setNotes] = useState("");
  const [communication, setCommunication] = useState("Call");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messageMenuAnchorEl, setMessageMenuAnchorEl] = useState<null | HTMLElement>(null);

   const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handleConfirm = () => {
    onConfirm({
      scheduled_time: scheduledTime,
      notes,
      communication,
    });
    setScheduledTime("");
    setNotes("");
    setCommunication("Call");
  };

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  const handleMessageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMessageMenuAnchorEl(event.currentTarget);
  };

  const handleMessageMenuClose = () => {
    setMessageMenuAnchorEl(null);
  };

  const handleMessageViaApp = () => {
    handleOpenChat();
    handleMessageMenuClose();
  };

  const handleMessageViaPhone = () => {
    if (provider?.phone) {
      window.location.href = `sms:${provider.phone}`;
    }
    handleMessageMenuClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700, fontSize: 22, color: "#147c3c" }}>
          Confirm Your Booking
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography fontWeight={600}>Service ID:</Typography>
            <Typography>{serviceId}</Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography fontWeight={600}>Provider:</Typography>
            <Typography>{provider?.name}</Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography fontWeight={600}>Your Location:</Typography>
            <Typography>
              {userLocation?.lat.toFixed(5)}, {userLocation?.lng.toFixed(5)}
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Preferred Date & Time"
            type="datetime-local"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Additional Notes"
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            margin="normal"
          />

          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
            Choose how you'd like to communicate after booking:
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            {communicationOptions.map((option) => (
              <Button
                key={option.label}
                variant={communication === option.label ? "contained" : "outlined"}
                color="primary"
                startIcon={option.icon}
                onClick={(e) => {
                  if (option.label === "Payment") {
                    setShowPaymentForm(true);
                  } else if (option.label === "Message") {
                    handleMessageMenuOpen(e);
                  } else {
                    setCommunication(option.label);
                  }
                }}
                sx={{ textTransform: "none", borderRadius: 2, px: 3 }}
              >
                {option.label}
              </Button>
            ))}
          </Stack>
          <Menu
            anchorEl={messageMenuAnchorEl}
            open={Boolean(messageMenuAnchorEl)}
            onClose={handleMessageMenuClose}
          >
            <MenuItem onClick={handleMessageViaApp}>Within App</MenuItem>
            <MenuItem onClick={handleMessageViaPhone}>Via Phone</MenuItem>
          </Menu>
            {/* *** RENDER PAYMENT FORM MODAL WHEN showPaymentForm IS TRUE *** */}
          {showPaymentForm && (
            <PaymentForm
              providerId={provider?.id ?? null}
              serviceId={serviceId ?? null}
              userLocation={userLocation ?? null}
              onClose={() => setShowPaymentForm(false)}
            />
          )}

        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
          <Button onClick={onClose} color="error" variant="outlined" sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2 }}
          >
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
      <ChatDialog
        open={isChatOpen}
        onClose={handleCloseChat}
        provider={provider}
      />
    </>
  );
};

export default BookingDialog;
