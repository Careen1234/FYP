import React, { useState, useEffect } from 'react';
import {
  Box, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Typography, Paper, Table, TableHead, TableRow,
  TableCell, TableBody, InputBase, IconButton, Snackbar, Alert,
  Button
} from '@mui/material';
import Grid from '@mui/material/Grid';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';

interface Provider {
  id: number;
  name: string;
  email: string;
  service: string;
  location: string;
  status: string;
}

const ProviderManagement: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', service: '', location: '' });
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);

  const fetchProviders = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/providers');
      setProviders(response.data as Provider[]);
    } catch (error) {
      console.error('Failed to fetch providers:', error);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleOpenModal = (provider?: Provider) => {
    if (provider) {
      setFormData(provider);
      setEditingId(provider.id);
      setEditMode(true);
    } else {
      setFormData({ name: '', email: '', service: '', location: '' });
      setEditMode(false);
      setEditingId(null);
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({ name: '', email: '', service: '', location: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editMode && editingId !== null) {
        await axios.put(`http://localhost:8000/api/providers/${editingId}`, formData);
        setSnackbar({ open: true, message: 'Provider updated', severity: 'success' });
      } else {
        await axios.post('http://localhost:8000/api/providers', formData);
        setSnackbar({ open: true, message: 'Provider added', severity: 'success' });
      }
      handleCloseModal();
      fetchProviders();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error saving provider', severity: 'error' });
    }
  };

  const handleDelete = async () => {
    if (confirmDeleteId === null) return;
    try {
      await axios.delete(`http://localhost:8000/api/providers/${confirmDeleteId}`);
      fetchProviders();
      setSnackbar({ open: true, message: 'Provider deleted', severity: 'success' });
      setConfirmDeleteId(null);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to delete provider', severity: 'error' });
    }
  };

  

  const handleBlockToggle = async (id: number, currentStatus: string) => {
    try {
      await axios.put(`http://localhost:8000/api/providers/${id}/block-toggle`, {
        status: currentStatus === 'blocked' ? 'approved' : 'blocked',
      });
      fetchProviders();
    } catch (error) {
      console.error('Block/Unblock failed:', error);
    }
  };

  // Placeholder for viewing provider profile
  const handleViewProfile = (provider: Provider) => {
    setSelectedProvider(provider);
    setOpenProfileModal(true);
    setSnackbar({ open: true, message: `Viewing profile for ${provider.name}`, severity: 'success' });
  };

  const filteredProviders = providers.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box p={4}>
      <Typography variant="h3" mb={2}>PROVIDERS MANAGEMENT</Typography>

      <Paper sx={{ p: 1, mb: 2, display: 'flex', alignItems: 'center', width: 300 }}>
        <InputBase
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ ml: 1, flex: 1 }}
        />
        <IconButton>
          <SearchIcon />
        </IconButton>
      </Paper>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Service</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredProviders.length > 0 ? (
            filteredProviders.map((provider: Provider) => (
              <TableRow key={provider.id}>
                <TableCell>{provider.id}</TableCell>
                <TableCell>{provider.name}</TableCell>
                <TableCell>{provider.email}</TableCell>
                <TableCell>{provider.service}</TableCell>
                <TableCell>{provider.location}</TableCell>
                <TableCell>{provider.status}</TableCell>
                <TableCell>
                  
                  
                  

                  <IconButton
                    aria-label="edit"
                    onClick={() => handleOpenModal(provider)}
                    title="Edit"
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    aria-label="delete"
                    color="error"
                    onClick={() => setConfirmDeleteId(provider.id)}
                    title="Delete"
                  >
                    <DeleteIcon />
                  </IconButton>

                  <IconButton
                    aria-label={provider.status === 'blocked' ? 'unblock' : 'block'}
                    color="secondary"
                    onClick={() => handleBlockToggle(provider.id, provider.status)}
                    title={provider.status === 'blocked' ? 'Unblock' : 'Block'}
                  >
                    {provider.status === 'blocked' ? <LockOpenIcon /> : <BlockIcon />}
                  </IconButton>

                  <IconButton onClick={() => handleViewProfile(provider)}>
                    <VisibilityIcon />
                  </IconButton>

                  
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">No rows</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Box mt={3}>
        <IconButton
          color="primary"
          onClick={() => handleOpenModal()}
          aria-label="add provider"
          title="Add Provider"
          size="large"
        >
          <EditIcon /> {/* You can replace with AddIcon if preferred */}
        </IconButton>
      </Box>

      <Dialog open={openModal} onClose={handleCloseModal} fullWidth>
        <DialogTitle>{editMode ? 'Edit Provider' : 'Add New Provider'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            {['name', 'email', 'service', 'location'].map((field) => (
              <Box key={field} display="flex" flexDirection="row" gap={2} width="100%" mb={2}>
                <TextField
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  value={formData[field as keyof typeof formData]}
                  onChange={handleChange}
                  fullWidth
                />
              </Box>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <IconButton onClick={handleCloseModal} color="secondary" title="Cancel">
            <CancelIcon />
          </IconButton>
          <IconButton onClick={handleSubmit} color="primary" title={editMode ? 'Update' : 'Submit'}>
            <CheckCircleIcon />
          </IconButton>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDeleteId !== null} onClose={() => setConfirmDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogActions>
          <IconButton onClick={() => setConfirmDeleteId(null)} color="secondary" title="Cancel">
            <CancelIcon />
          </IconButton>
          <IconButton onClick={handleDelete} color="error" title="Delete">
            <DeleteIcon />
          </IconButton>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog open={openProfileModal} onClose={() => setOpenProfileModal(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ backgroundColor: '#a5d6a7', color: 'black' }}>Provider Profile</DialogTitle>
        <DialogContent dividers>
          {selectedProvider && (
            <Box>
              <Typography><strong>Name:</strong> {selectedProvider.name}</Typography>
              <Typography><strong>Email:</strong> {selectedProvider.email}</Typography>
              <Typography><strong>Phone:</strong> {selectedProvider.phone}</Typography>
              <Typography><strong>Availability:</strong> {selectedProvider.availability ? 'Available' : 'Not Available'}</Typography>
              <Typography><strong>Status:</strong> {selectedProvider.is_approved ? 'Approved' : 'Pending'}</Typography>
              <Typography><strong>Blocked:</strong> {selectedProvider.is_blocked ? 'Yes' : 'No'}</Typography>
              <Typography><strong>Bookings:</strong> {selectedProvider.bookings?.length || 0}</Typography>
              <Typography><strong>Completed Services:</strong> {selectedProvider.completed_services || 0}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProfileModal(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProviderManagement;
