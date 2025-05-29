import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ContactModal from './ContactModal';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleContactClick = () => {
    console.log('Contact clicked'); // Debug log
    setIsContactModalOpen(true);
    handleClose();
  };

  const handleCloseContactModal = () => {
    console.log('Closing modal'); // Debug log
    setIsContactModalOpen(false);
  };

  const handleLogin = () => {
    navigate('/auth');
    handleClose();
  };

  const handleRegister = () => {
    navigate('/auth?mode=register');
    handleClose();
  };

  return (
    <div>
      <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: 1 }}>
        <Toolbar>
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

          {isMobile ? (
            <>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMenu}
                sx={{ color: '#147c3c' }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleContactClick}>Contact</MenuItem>
                <MenuItem onClick={handleLogin}>Login</MenuItem>
                <MenuItem onClick={handleRegister}>Register</MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                color="inherit"
                onClick={handleContactClick}
                sx={{ color: '#147c3c' }}
              >
                Contact
              </Button>
              <Button
                color="inherit"
                onClick={handleLogin}
                sx={{ color: '#147c3c' }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                onClick={handleRegister}
                sx={{
                  backgroundColor: '#147c3c',
                  '&:hover': {
                    backgroundColor: '#0f5c2c',
                  },
                }}
              >
                Register
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      {/* Ensure ContactModal is rendered outside of AppBar */}
      <ContactModal 
        open={isContactModalOpen} 
        onClose={handleCloseContactModal}
      />
    </div>
  );
};

export default Navbar; 