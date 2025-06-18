import React from 'react';
import { Typography, Box } from '@mui/material';

const ProviderDashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome to Your Dashboard
      </Typography>
      <Typography>
        View your service stats, recent requests, and important updates here.
      </Typography>
    </Box>
  );
};

export default ProviderDashboard;
