import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

const roles = [
  { value: 'user', label: 'User' },
  { value: 'provider', label: 'Provider' },
];

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    role: 'user',
    password: '',
    password_confirmation: '',
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess('');

    try {
      const response = await axios.post(' http://localhost:8000/api/register', formData);
      setSuccess('Registration successful! You can now login.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        location: '',
        role: 'user',
        password: '',
        password_confirmation: '',
      });
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      maxWidth={400}
      mx="auto"
      mt={4}
      p={3}
      boxShadow={3}
      borderRadius={2}
      component="form"
      onSubmit={handleSubmit}
    >
      <Typography variant="h5" mb={3} align="center">
        Register
      </Typography>

      {errors.general && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.general}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        margin="normal"
        error={Boolean(errors.name)}
        helperText={errors.name?.[0]}
        required
      />

      <TextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        margin="normal"
        error={Boolean(errors.email)}
        helperText={errors.email?.[0]}
        required
      />

      <TextField
  fullWidth
  label="Phone"
  name="phone"
  value={formData.phone}
  onChange={handleChange}
  margin="normal"
  required
  error={Boolean(errors.phone)}
  helperText={errors.phone?.[0]}
/>


      <TextField
        fullWidth
        label="Location (optional)"
        name="location"
        value={formData.location}
        onChange={handleChange}
        margin="normal"
        error={Boolean(errors.location)}
        helperText={errors.location?.[0]}
      />

      <TextField
        select
        fullWidth
        label="Role"
        name="role"
        value={formData.role}
        onChange={handleChange}
        margin="normal"
        error={Boolean(errors.role)}
        helperText={errors.role?.[0]}
        required
      >
        {roles.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        margin="normal"
        error={Boolean(errors.password)}
        helperText={errors.password?.[0]}
        required
      />

      <TextField
        fullWidth
        label="Confirm Password"
        name="password_confirmation"
        type="password"
        value={formData.password_confirmation}
        onChange={handleChange}
        margin="normal"
        error={Boolean(errors.password_confirmation)}
        helperText={errors.password_confirmation?.[0]}
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
        {loading ? <CircularProgress size={24} /> : 'Register'}
      </Button>
    </Box>
  );
}
