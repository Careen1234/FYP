import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

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
  }) => void;
}

const BookingDialog: React.FC<BookingDialogProps> = ({
  open,
  onClose,
  provider,
  serviceId,
  userLocation,
  onConfirm,
}) => {
  const [scheduledTime, setScheduledTime] = useState("");
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();

  const handleConfirm = () => {
    if (!provider || !serviceId || !userLocation) return;
    onConfirm({
      scheduled_time: scheduledTime,
      notes: notes,
    });
  };

  return (
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
  );
};

export default BookingDialog;
