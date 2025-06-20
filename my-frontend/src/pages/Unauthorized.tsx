
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      textAlign="center"
      p={2}
    >
      <Typography variant="h3" gutterBottom color="error">
        
      </Typography>
      <Typography variant="h6" mb={3}>
        You do not have permission to access this page.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate("/")}>
        Back to Home
      </Button>
    </Box>
  );
};

export default Unauthorized;
