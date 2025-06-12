import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#147c3c',
        color: 'white',
        py: 2,
        px: 3,
        textAlign: 'center',
        mt: 'auto',
        position: 'sticky',
        bottom: 0,
        width: '100%',
      }}
    >
      <Typography variant="body2">
        &copy; {new Date().getFullYear()} QuickAssist. All rights reserved.
      </Typography>
      <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
        <Link href="/privacy" color="inherit" underline="hover" sx={{ mx: 1 }}>
          Privacy Policy
        </Link>
        |
        <Link href="/terms" color="inherit" underline="hover" sx={{ mx: 1 }}>
          Terms of Service
        </Link>
        |
        <Link href="/contact" color="inherit" underline="hover" sx={{ mx: 1 }}>
          Contact Us
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;
