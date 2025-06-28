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
import { useAuth } from "../components/AuthContext";

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      interface LoginResponse {
        token: string;
        user: {
          name?: string;
          email: string;
          role: string;
        };
      }

      const response = await axios.post<LoginResponse>("http://localhost:8000/api/login", {
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = response.data;

      if (!token || !user || !user.role) {
        throw new Error("Invalid login response");
      }

      // Save token to localStorage
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Ensure role is one of the allowed types
      const allowedRoles = ["admin", "provider", "user"] as const;
      type AllowedRole = typeof allowedRoles[number];

      const mappedRole = allowedRoles.includes(user.role as AllowedRole)
        ? (user.role as AllowedRole)
        : "user";

      const userInfo = {
        name: user.name || "User",
        email: user.email,
        role: mappedRole,
      };

      localStorage.setItem("user", JSON.stringify(userInfo));
      setUser(userInfo);

      // Redirect based on role
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "provider") {
        navigate("/provider/dashboard");
      } else if (user.role === "user") {
        navigate("/user");
      } else {
        setError("Unknown role. Contact support.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.response?.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError("Login failed. Please try again.");
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

      {error && <Alert severity="error">{error}</Alert>}

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
