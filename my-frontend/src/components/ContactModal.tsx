import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PhoneIcon from '@mui/icons-material/Phone';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ open, onClose }) => {
  useEffect(() => {
    console.log('Modal open state:', open); // Debug log
  }, [open]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 3,
        },
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #e0e0e0',
        padding: '16px 24px',
      }}>
        Contact Us
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
            '&:hover': {
              color: (theme) => theme.palette.grey[700],
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ padding: '24px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <PhoneIcon sx={{ color: '#147c3c', fontSize: 28 }} />
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" color="#147c3c">
                Phone Numbers
              </Typography>
              <Typography variant="body1">0714250201</Typography>
              <Typography variant="body1">0620827896</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <InstagramIcon sx={{ color: '#147c3c', fontSize: 28 }} />
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" color="#147c3c">
                Instagram
              </Typography>
              <Typography variant="body1">@Gcheryl5</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LinkedInIcon sx={{ color: '#147c3c', fontSize: 28 }} />
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" color="#147c3c">
                LinkedIn
              </Typography>
              <Typography variant="body1">Grace Mwolo</Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px', backgroundColor: '#f5f5f5' }}>
        <Button 
          onClick={onClose} 
          variant="contained"
          sx={{ 
            backgroundColor: '#147c3c',
            '&:hover': {
              backgroundColor: '#0f5c2c',
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContactModal; 