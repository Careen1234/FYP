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
import { useAuth } from "../components/AuthContext"; // 👈 import useAuth

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

      // Step 2: Send login request
      const response = await api.post("/api/login", {
        email: formData.email,
        password: formData.password,
      });

      // Type assertion for response.data
      type UserResponse = { name?: string; role?: string };
      const data = response.data as UserResponse;

      console.log("Login success:", data);

      // Assume response includes full user info like { name, email, role }
      const validRoles = ["admin", "provider", "user"] as const;
      type Role = typeof validRoles[number];
      const userRole = validRoles.includes(data.role as Role) ? (data.role as Role) : undefined;

      if (!userRole) {
        setError("Unknown role received. Please contact support.");
        setLoading(false);
        return;
      }

      const user = {
        name: data.name || "User",
        email: formData.email,
        role: userRole,
      };

      // Save to localStorage and AuthContext
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      // Step 3: Redirect based on role
      if (userRole === "admin") {
        console.log("Redirecting to /admin/dashboard");
        navigate("/admin/dashboard");
      } else if (userRole === "provider") {
        console.log("Redirecting to /provider/dashboard");
        navigate("/provider/dashboard");
      } else if (userRole === "user") {
        console.log("Redirecting to /user");
        navigate("/user");
      } else {
        console.warn("Unknown role:", userRole);
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
