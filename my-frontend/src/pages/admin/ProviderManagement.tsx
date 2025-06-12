import React, { useState, useEffect } from 'react';
import {
  Box, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Typography, Paper, Table, TableHead, TableRow,
  TableCell, TableBody, InputBase, IconButton, Snackbar, Alert,
  Button,
} from '@mui/material';
import { Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Add } from '@mui/icons-material';
import axios from 'axios';

interface Provider {
  id: number;
  name: string;
  email: string;
  phone?: string;
  service: string;
  location: string;
  status: string; // e.g., 'pending', 'approved', 'blocked'
  availability?: string; // e.g., 'available', 'not available'
  is_approved?: boolean;
  is_blocked?: boolean;
  bookings?: any[];
  completed_services?: number;
}

const ProviderManagement: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    location: '',
    status: 'pending',
    availability: 'available',
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  // Fetch providers from API
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

  // Open modal for Add or Edit
  const handleOpenModal = (provider?: Provider) => {
    if (provider) {
      setFormData({
        name: provider.name,
        email: provider.email,
        phone: provider.phone || '',
        service: provider.service,
        location: provider.location,
        status: provider.status || 'pending',
        availability: provider.availability || 'available',
      });
      setEditingId(provider.id);
      setEditMode(true);
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        location: '',
        status: 'pending',
        availability: 'available',
      });
      setEditingId(null);
      setEditMode(false);
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: '',
      location: '',
      status: 'pending',
      availability: 'available',
    });
  };

  // Form field change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit add or update provider
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

  // Delete provider
  const handleDelete = async () => {
    if (confirmDeleteId === null) return;
    try {
      await axios.delete(`http://localhost:8000/api/providers/${confirmDeleteId}`);
      setSnackbar({ open: true, message: 'Provider deleted', severity: 'success' });
      fetchProviders();
      setConfirmDeleteId(null);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to delete provider', severity: 'error' });
    }
  };

  // Block or Unblock provider toggle
  const handleBlockToggle = async (id: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'blocked' ? 'approved' : 'blocked';
      await axios.put(`http://localhost:8000/api/providers/${id}/block-toggle`, {
        status: newStatus,
      });
      setSnackbar({ open: true, message: `Provider ${newStatus}`, severity: 'success' });
      fetchProviders();
    } catch (error) {
      setSnackbar({ open: true, message: 'Block/Unblock failed', severity: 'error' });
    }
  };

  // View provider profile modal
  const handleViewProfile = (provider: Provider) => {
    setSelectedProvider(provider);
    setOpenProfileModal(true);
    setSnackbar({ open: true, message: `Viewing profile for ${provider.name}`, severity: 'success' });
  };

  // Filter providers based on search query
  const filteredProviders = providers.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box p={6}>
      <Typography variant="h5" sx={{ color: '#147c3c', mb: 2 }}>
       PROVIDERS MANAGEMENT
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
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

        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ backgroundColor: '#147c3c', '&:hover': { backgroundColor: '##147c3c' } }}
          onClick={() => handleOpenModal()}
        >
          Add Provider
        </Button>
      </Box>

      <Table>
        <TableHead sx={{ backgroundColor: '#147c3c' }}>
          <TableRow>
            <TableCell sx={{ color: 'white' }}>ID</TableCell>
            <TableCell sx={{ color: 'white' }}>Name</TableCell>
            <TableCell sx={{ color: 'white' }}>Email</TableCell>
            <TableCell sx={{ color: 'white' }}>Service</TableCell>
            <TableCell sx={{ color: 'white' }}>Location</TableCell>
            <TableCell sx={{ color: 'white' }}>Status</TableCell>
            <TableCell sx={{ color: 'white' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredProviders.length > 0 ? (
            filteredProviders.map((provider) => (
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

                  <IconButton onClick={() => handleViewProfile(provider)} title="View Profile">
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">
                No rows
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Add/Edit Provider Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth>
        <DialogTitle>{editMode ? 'Edit Provider' : 'Add New Provider'}</DialogTitle>
        <DialogContent>
          <Box
  display="grid"
  gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }}
  gap={2}
  mt={1}
>
  <TextField
    label="Name"
    name="name"
    value={formData.name}
    onChange={handleChange}
    fullWidth
    required
  />
  <TextField
    label="Email"
    name="email"
    type="email"
    value={formData.email}
    onChange={handleChange}
    fullWidth
    required
  />
 
  <TextField
    label="Service"
    name="service"
    value={formData.service}
    onChange={handleChange}
    fullWidth
    required
  />
  <TextField
    label="Location"
    name="location"
    value={formData.location}
    onChange={handleChange}
    fullWidth
    required
  />
  <Box display="flex" gap={2} flexWrap="wrap">
    <TextField
      label="Status"
      name="status"
      value={formData.status}
      onChange={handleChange}
      select
      SelectProps={{ native: true }}
      fullWidth
      sx={{ flex: '1 1 200px' }}
    >
      <option value="pending">Pending</option>
      <option value="approved">Approved</option>
      <option value="blocked">Blocked</option>
    </TextField>
    <TextField
      label="Availability"
      name="availability"
      value={formData.availability}
      onChange={handleChange}
      select
      SelectProps={{ native: true }}
      fullWidth
      sx={{ flex: '1 1 200px' }}
    >
      <option value="available">Available</option>
      <option value="not available">Not Available</option>
    </TextField>
  </Box>
</Box>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ backgroundColor: '#147c3c' }}>
            {editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={!!confirmDeleteId} onClose={() => setConfirmDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this provider?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteId(null)} color="secondary">Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Provider Profile Modal */}
      <Dialog open={openProfileModal} onClose={() => setOpenProfileModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>Provider Profile</DialogTitle>
        <DialogContent dividers>
          {selectedProvider ? (
            <>
              <Typography variant="subtitle1"><strong>Name:</strong> {selectedProvider.name}</Typography>
              <Typography variant="subtitle1"><strong>Email:</strong> {selectedProvider.email}</Typography>
              <Typography variant="subtitle1"><strong>Phone:</strong> {selectedProvider.phone || 'N/A'}</Typography>
              <Typography variant="subtitle1"><strong>Service:</strong> {selectedProvider.service}</Typography>
              <Typography variant="subtitle1"><strong>Location:</strong> {selectedProvider.location}</Typography>
              <Typography variant="subtitle1"><strong>Status:</strong> {selectedProvider.status}</Typography>
              <Typography variant="subtitle1"><strong>Availability:</strong> {selectedProvider.availability}</Typography>
              <Typography variant="subtitle1"><strong>Completed Services:</strong> {selectedProvider.completed_services || 0}</Typography>
            </>
          ) : (
            <Typography>No provider selected</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProfileModal(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProviderManagement;
