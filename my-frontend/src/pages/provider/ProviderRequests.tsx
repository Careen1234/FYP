import React from 'react';
import { Typography, Box } from '@mui/material';

const ProviderRequests: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Service Requests
      </Typography>
      <Typography>
        View and respond to incoming service requests.
      </Typography>
    </Box>
  );
};

export default ProviderRequests;
