import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      interface LoginResponse {
        user: {
          role: string;
          [key: string]: any;
        };
        [key: string]: any;
      }

      const response = await axios.post<LoginResponse>('http://localhost:8000/api/login', formData, {
        withCredentials: true
      });

      const user = response.data.user;
      setSuccessMsg('Login successful! Redirecting...');

      // Store user in localStorage or context
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect based on role
      switch (user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'provider':
          navigate('/provider/dashboard');
          break;
        case 'user':
          navigate('/dashboard');
          break;
        default:
          navigate('/');
      }

    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={4} p={3} boxShadow={3} borderRadius={2} component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" mb={3} align="center">Login</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {successMsg && <Alert severity="success" sx={{ mb: 2, backgroundColor: '#147c3c', color: 'white' }}>{successMsg}</Alert>}

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
      <Button type="submit" variant="contained" color="success" fullWidth disabled={loading} sx={{ mt: 2 }}>
        {loading ? <CircularProgress size={24} /> : 'Login'}
      </Button>
    </Box>
  );
}
