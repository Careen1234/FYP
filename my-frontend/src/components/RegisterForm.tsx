import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
} from '@mui/material';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  initialUserType?: 'client' | 'provider' | null;
}

type UserType = 'client' | 'provider' | null;

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin, initialUserType = null }) => {
  const [userType, setUserType] = useState<UserType>(initialUserType);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    service: '', // Only for providers
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (initialUserType) {
      setUserType(initialUserType);
    }
  }, [initialUserType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userType,
        }),
      });

      if (response.ok) {
        alert('Registration successful! Please login.');
        onSwitchToLogin();
      } else {
        const error = await response.json();
        alert(error.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred during registration');
    }
  };

  if (!userType) {
    return (
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
              Choose your registration type
            </Typography>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => setUserType('client')}
                sx={{
                  backgroundColor: '#147c3c',
                  '&:hover': {
                    backgroundColor: '#0f5c2c',
                  },
                }}
              >
                Join as a Client
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setUserType('provider')}
                sx={{
                  borderColor: '#147c3c',
                  color: '#147c3c',
                  '&:hover': {
                    borderColor: '#0f5c2c',
                    backgroundColor: 'rgba(20, 124, 60, 0.04)',
                  },
                }}
              >
                Become a Provider
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Register as {userType === 'client' ? 'a Client' : 'a Provider'}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                required
                fullWidth
                id="fullName"
                label="Full Name"
                name="fullName"
                autoComplete="name"
                value={formData.fullName}
                onChange={handleInputChange}
              />
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <TextField
                required
                fullWidth
                id="phoneNumber"
                label="Phone Number"
                name="phoneNumber"
                autoComplete="tel"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              {userType === 'provider' && (
                <TextField
                  required
                  fullWidth
                  id="service"
                  label="Service You Provide"
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                />
              )}
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: '#147c3c',
                '&:hover': {
                  backgroundColor: '#0f5c2c',
                },
              }}
            >
              Register
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => setUserType(null)}
                sx={{ color: '#147c3c' }}
              >
                Back
              </Link>
              <Link
                component="button"
                variant="body2"
                onClick={onSwitchToLogin}
                sx={{ color: '#147c3c' }}
              >
                Already have an account? Sign in
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterForm; 