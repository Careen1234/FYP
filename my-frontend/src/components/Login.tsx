import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  InputAdornment,
  Link
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../components/AuthContext";
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

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
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #f8fafc, #e2f0eb)',
        p: 2
      }}
    >
      <Box
        component={Paper}
        elevation={3}
        sx={{
          maxWidth: 450,
          width: '100%',
          p: 4,
          borderRadius: 3,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(20, 124, 60, 0.1)',
          background: 'white'
        }}
      >
        <Box textAlign="center" mb={4}>
          <Box
            sx={{
              bgcolor: 'rgba(20, 124, 60, 0.1)',
              width: 70,
              height: 70,
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2
            }}
          >
            <LockIcon sx={{ color: '#147c3c', fontSize: 36 }} />
          </Box>
          <Typography 
            variant="h5" 
            fontWeight={700}
            sx={{ color: '#0d5a2c', mb: 1 }}
          >
            Welcome Back
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Sign in to your account to continue
          </Typography>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              border: '1px solid #ffebee'
            }}
          >
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: '#94a3b8' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: '#e2e8f0',
                },
                '&:hover fieldset': {
                  borderColor: '#cbd5e1',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#147c3c',
                  borderWidth: 1,
                },
              }
            }}
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: '#94a3b8' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: '#e2e8f0',
                },
                '&:hover fieldset': {
                  borderColor: '#cbd5e1',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#147c3c',
                  borderWidth: 1,
                },
              }
            }}
          />

          <Box textAlign="right" mb={3}>
            <Link 
              href="#" 
              underline="hover" 
              sx={{ 
                color: '#147c3c', 
                fontSize: '0.875rem',
                fontWeight: 500,
                '&:hover': {
                  color: '#0d5a2c'
                }
              }}
            >
              Forgot password?
            </Link>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              bgcolor: '#147c3c',
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#0d5a2c',
                boxShadow: '0 4px 12px rgba(20, 124, 60, 0.25)'
              },
              '&.Mui-disabled': {
                bgcolor: '#e2e8f0',
                color: '#94a3b8'
              }
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign In'}
          </Button>
        </Box>

        <Box mt={3} textAlign="center">
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Don't have an account?{' '}
            <Link 
              href="#" 
              underline="hover" 
              sx={{ 
                color: '#147c3c', 
                fontWeight: 600,
                '&:hover': {
                  color: '#0d5a2c'
                }
              }}
            >
              Create account
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}