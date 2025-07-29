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

const PaymentForm: React.FC<PaymentProps> = ({ bookingId, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState("mobile_money");
  const [provider, setProvider] = useState("TIGO");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("15000");
  const [orderReference, setOrderReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePayment = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    // Generate unique order reference
    const reference = `CP${Date.now()}${Math.floor(Math.random() * 100000)}`;
    setOrderReference(reference); // update UI

    if (paymentMethod === "cash") {
      setMessage("Cash payment selected. Please pay the provider directly.");
      setLoading(false);
      return;
    }

    if (!/^255\d{9}$/.test(phoneNumber)) {
      setError("Please enter a valid phone number starting with 255...");
      setLoading(false);
      return;
    }

    try {
      console.log("Using order reference:", reference);
      const response = await axios.post(
        "http://localhost:8000/api/clickpesa/initiate",
        {
          amount: parseFloat(amount),
          currency: "TZS",
          orderReference: reference, // Laravel expects this key
          phoneNumber: phoneNumber.replace(/\D/g, ""), // Strip any non-numeric chars
          checksum: "", // Required but unused in your backend
        },
        { withCredentials: true }
      );

      const data = response.data as { success: boolean; message?: string };
      if (data.success) {
        setMessage("Payment initiated. Check your phone.");
      } else {
        setError(data.message || "Payment failed.");
      }
    } catch (err: any) {
      if (err.response) {
        const { message, error: backendError } = err.response.data;
        setError(`${message}${backendError ? `: ${backendError}` : ""}`);
      } else {
        setError("Network or server error.");
      }
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
          <FormControlLabel
            value="cash"
            control={<Radio />}
            label="Pay with Cash"
          />
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
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              margin="dense"
              required
            />

            <TextField
              label="Amount (TZS)"
              fullWidth
              type="number"
              inputProps={{ min: 100 }}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              margin="dense"
              required
            />

            <TextField
              label="Currency"
              value="TZS"
              margin="dense"
              fullWidth
              InputProps={{ readOnly: true }}
              disabled
            />

            <TextField
              label="Order Reference"
              value={orderReference}
              margin="dense"
              fullWidth
              InputProps={{ readOnly: true }}
              disabled
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
        {message && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
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

export default PaymentForm;
