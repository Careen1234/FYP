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

    const isAdminEmail = formData.email === "admin@gmail.com";

    try {
      if (isAdminEmail) {
        // Attempt admin login
        const response = await axios.post<{ token: string; role: string; id: string }>(
          "http://localhost:8000/api/admin/login",
          {
            password: formData.password,
          }
        );

        const { token, role, id } = response.data;

        if (role !== "admin") throw new Error("Unauthorized");

        const adminInfo = {
          name: "Admin",
          email: "admin@gmail.com",
          role: "admin" as const,
          id: Number(id),
        };

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(adminInfo));
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(adminInfo);
        navigate("/admin/dashboard");

      } else {
        // Normal user/provider login
        const response = await axios.post<{ token: string; user: { id?: number | string; name?: string; email: string; role: string } }>(
          "http://localhost:8000/api/login",
          {
            email: formData.email,
            password: formData.password,
          }
        );

        const { token, user } = response.data;

        if (!user || !token) throw new Error("Invalid response");

        const userInfo = {
          id: user.id ? Number(user.id) : 0,
          name: user.name || "User",
          email: user.email,
          role: user.role as "admin" | "user" | "provider",
        };

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userInfo));
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(userInfo);

        // Redirect by role
        if (user.role === "admin") {
          navigate("/admin/dashboard");
        } else if (user.role === "provider") {
          navigate("/provider/dashboard"); 
        } else {
          navigate("/user");
        }
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      if (err.response?.status === 401) {
        setError("Invalid credentials.");
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
