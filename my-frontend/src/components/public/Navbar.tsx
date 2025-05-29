import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import './Navbar.css';
import '../ContactModal';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: '#147c3c',
              fontWeight: 'bold',
            }}
          >
            QuickAssist
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              component={Link}
              to="/services"
              color="inherit"
              sx={{ color: '#4b5563' }}
            >
              Services
            </Button>
            <Button
              component={Link}
              to="/book"
              color="inherit"
              sx={{ color: '#4b5563' }}
            >
              Book Now
            </Button>
            <Button
              component={Link}
              to="/about"
              color="inherit"
              sx={{ color: '#4b5563' }}
            >
              About us
            </Button>
            <Button
              component={Link}
              to="/contact"
              color="inherit"
              sx={{ color: '#4b5563' }}
              onClick={() => navigate('/auth?mode=ContactModal')}
            >
              Contact
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/auth?mode=login')}
              sx={{
                backgroundColor: '#147c3c',
                '&:hover': {
                  backgroundColor: '#0f5c2c',
                },
              }}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/auth?mode=register')}
              sx={{
                borderColor: '#147c3c',
                color: '#147c3c',
                '&:hover': {
                  borderColor: '#0f5c2c',
                  backgroundColor: 'rgba(20, 124, 60, 0.04)',
                },
              }}
            >
              Register
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 