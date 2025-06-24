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
import axios from "axios"; // Adjust the import path as necessary

import tigoLogo from "../../assets/tigo.png";
import airtelLogo from "../../assets/airtel.png";
import vodacomLogo from "../../assets/vodacom.png";
import halotelLogo from "../../assets/halotel.png";


interface PaymentFormProps {
  bookingDetails: {
    providerId: number | null;
    serviceId: number | null;
    userLocation: { lat: number; lng: number } | null;
  };
  onClose: () => void;
}

const PROVIDER_LOGOS: Record<string, string> = {
  TIGO: tigoLogo,
  AIRTEL: airtelLogo,
  VODACOM: vodacomLogo,
  HALOTEL: halotelLogo,
};


const PaymentForm: React.FC<PaymentFormProps> = ({ bookingDetails, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState("mobile_money");
  const [provider, setProvider] = useState("TIGO");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("15000");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

const token = localStorage.getItem("auth_token");


  const handlePayment = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    if (!token) {
      setError("You must be logged in to make a payment.");
      setLoading(false);
      return;
    }

    if (paymentMethod === "cash") {
      setMessage("Cash payment selected. Please pay the provider directly.");
      setLoading(false);
      return;
    }

    if (paymentMethod === "mobile_money") {
      if (!phone.match(/^255\d{9}$/)) {
        setError("Please enter a valid mobile number starting with 255...");
        setLoading(false);
        return;
      }

      try {
        interface PaymentResponse {
          success?: boolean;
          [key: string]: any;
        }
        const response = await axios.post<PaymentResponse>(
          "http://localhost:8000/api/payments/initiate",
          {
            amount: Number(amount),
            currency: "TZS",
            accountNumber: phone,
            provider,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (response.data?.success || response.status === 200) {
          setMessage("Payment initiated successfully. Check your phone to complete.");
        } else {
          setError("Failed to initiate payment. Please try again.");
        }
      } catch (err: any) {
        console.error("Payment error:", err.response || err.message);
        const backendMessage = err.response?.data?.message || "Server error occurred.";
        setError(backendMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Choose Payment Method</DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Typography sx={{ mb: 2 }}>Select how you'd like to pay:</Typography>

        <RadioGroup
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          sx={{ mb: 2 }}
        >
          <FormControlLabel value="cash" control={<Radio />} label="Pay with Cash" />
          <FormControlLabel
            value="mobile_money"
            control={<Radio />}
            label="Pay with Mobile Money (AzamPay)"
          />
        </RadioGroup>

        {paymentMethod === "mobile_money" && (
          <>
            <TextField
              label="Mobile Money Phone Number"
              placeholder="e.g. 2557XXXXXXXX"
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              margin="dense"
            />

            <TextField
              label="Amount (TZS)"
              fullWidth
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              margin="dense"
              type="number"
              inputProps={{ min: 1 }}
            />

            <Typography sx={{ mt: 2, mb: 1 }}>
              Select Mobile Money Provider:
            </Typography>

            <RadioGroup
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              row
            >
       {Object.keys(PROVIDER_LOGOS).map((p) => (
      <FormControlLabel
        key={p}
        value={p}
        control={<Radio />}
        label={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img 
              src={PROVIDER_LOGOS[p]} 
              alt={p} 
              style={{ width: 40, height: 40, objectFit: "contain" }} 
            />
            <span>{p}</span>
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

      <DialogActions sx={{ px: 2, pb: 2, justifyContent: "space-between" }}>
        <Button onClick={onClose} variant="outlined" color="error" disabled={loading}>
          Cancel
        </Button>

        <Button
          onClick={handlePayment}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? "Processing..." : "Confirm Payment"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentForm;
