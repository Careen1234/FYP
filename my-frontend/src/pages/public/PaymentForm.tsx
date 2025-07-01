import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Alert,
  TextField,
} from "@mui/material";
import axios from "axios";

import tigoLogo from "../../assets/tigo.png";
import airtelLogo from "../../assets/airtel.png";
import vodacomLogo from "../../assets/vodacom.png";
import halotelLogo from "../../assets/halotel.png";

interface PaymentProps {
  bookingId: number;
  onClose: () => void;
}

const PROVIDER_LOGOS: Record<string, string> = {
  TIGO: tigoLogo,
  AIRTEL: airtelLogo,
  VODACOM: vodacomLogo,
  HALOTEL: halotelLogo,
};

const Payment: React.FC<PaymentProps> = ({ bookingId, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState("mobile_money");
  const [provider, setProvider] = useState("TIGO");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("15000");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePayment = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    // 1. Require login
    try {
      const userRes = await axios.get("http://localhost:8000/api/user", {
        withCredentials: true,
      });
      if (!userRes.data) throw new Error("User not authenticated");
    } catch {
      setError("You must be logged in to make a payment.");
      setLoading(false);
      return;
    }

    // 2. Cash option
    if (paymentMethod === "cash") {
      setMessage("Cash payment selected. Please pay the provider directly.");
      setLoading(false);
      return;
    }

    // 3. Mobile money validation
    if (!phone.match(/^255\d{9}$/)) {
      setError("Please enter a valid phone number starting with 255...");
      setLoading(false);
      return;
    }

    try {
      
      // Make payment request
      const response = await axios.post(
        "http://localhost:8000/api/payment/initiate",
        {
          amount: Number(amount),
          currency: "TZS",
          accountNumber: phone,
          provider,
          booking_id: bookingId,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setMessage("Payment initiated. Check your phone to complete.");
      } else {
        setError("Payment failed. Please try again.");
      }
    } catch (err: any) {
      const backendError = err?.response?.data?.message || "Server error occurred.";
      setError(backendError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Confirm Payment</DialogTitle>

      <DialogContent>
        <Typography sx={{ mb: 2 }}>Choose your payment method:</Typography>

        <RadioGroup
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <FormControlLabel value="cash" control={<Radio />} label="Pay with Cash" />
          <FormControlLabel
            value="mobile_money"
            control={<Radio />}
            label="Mobile Money (ClickPesa)"
          />
        </RadioGroup>

        {paymentMethod === "mobile_money" && (
          <>
            <TextField
              label="Phone Number"
              placeholder="2557XXXXXXXX"
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              margin="dense"
            />

            <TextField
              label="Amount (TZS)"
              fullWidth
              type="number"
              inputProps={{ min: 1 }}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              margin="dense"
            />

            <Typography sx={{ mt: 2 }}>Select Provider:</Typography>
            <RadioGroup
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              row
            >
              {Object.entries(PROVIDER_LOGOS).map(([key, logo]) => (
                <FormControlLabel
                  key={key}
                  value={key}
                  control={<Radio />}
                  label={
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <img src={logo} alt={key} width={40} height={40} />
                      <span>{key}</span>
                    </div>
                  }
                />
              ))}
            </RadioGroup>
          </>
        )}

        {loading && <CircularProgress sx={{ mt: 2 }} />}
        {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading} color="error" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handlePayment} disabled={loading} variant="contained">
          {loading ? "Processing..." : "Confirm Payment"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Payment;
