import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth, type User } from "../components/AuthContext"; // 👈 import useAuth

// Axios instance with CSRF + credentials support
const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth(); // 👈 get setUser from AuthContext

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Step 1: Get CSRF cookie
      await api.get("/sanctum/csrf-cookie");

      type LoginResponse = {
        message: string;
        user: User;
      };

      // Step 2: Send login request
      const response = await api.post<LoginResponse>("/api/login", {
        email: formData.email,
        password: formData.password,
      });

      const { user } = response.data;

      if (!user || !user.id || !user.role) {
        setError("Invalid login response from server.");
        setLoading(false);
        return;
      }

      console.log("Login success:", user);

      // Save to localStorage and AuthContext
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      // Step 3: Redirect based on role
      if (user.role === "admin") {
        console.log("Redirecting to /admin/dashboard");
        navigate("/admin/dashboard");
      } else if (user.role === "provider") {
        console.log("Redirecting to /provider/dashboard");
        navigate("/provider/dashboard");
      } else if (user.role === "user") {
        console.log("Redirecting to /user");
        navigate("/user");
      } else {
        console.warn("Unknown role:", user.role);
        setError("Unknown role received. Please contact support.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.response?.status === 401) {
        setError("Invalid email or password.");
      } else if (error.response?.status === 419) {
        setError("CSRF token mismatch. Please refresh and try again.");
      } else {
        setError("Login failed. Please check your server or credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      maxWidth={400}
      mx="auto"
      mt={4}
      p={3}
      boxShadow={3}
      borderRadius={2}
    >
      <Typography variant="h5" mb={3} align="center">
        Login
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        margin="normal"
        required
      />

      <Button
        type="submit"
        variant="contained"
        color="success"
        fullWidth
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : "Login"}
      </Button>
    </Box>
  );
}
