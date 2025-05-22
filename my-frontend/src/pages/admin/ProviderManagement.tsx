import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Edit, Delete, CheckCircle, Block, Visibility } from '@mui/icons-material';
import {
  fetchProviders,
  fetchProviderDetails,
  addProvider,
  updateProvider,
  deleteProvider,
  approveProvider,
  blockProvider
} from '../../api/providerApi';

const ProviderManagement = () => {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [newProvider, setNewProvider] = useState<any>({ name: '', email: '', service: '', location: '' });
  const [providerProfile, setProviderProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Fetch providers on component mount
  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    setLoading(true);
    try {
      const response = await fetchProviders();
      setProviders(response.data as any[]);
    } catch (error) {
      console.error('Failed to fetch providers:', error);
    }
    setLoading(false);
  };

  // Approve
  const handleApprove = async (id: number) => {
    try {
      await approveProvider(id);
      loadProviders();
    } catch (error) {
      console.error('Failed to approve:', error);
    }
  };

  // Block
  const handleBlock = async (id: number) => {
    try {
      await blockProvider(id);
      loadProviders();
    } catch (error) {
      console.error('Failed to block:', error);
    }
  };

  // Edit
  const handleEdit = (provider: any) => {
    setSelectedProvider(provider);
    setEditDialogOpen(true);
  };

  // Delete
  const handleDelete = async (id: number) => {
    try {
      await deleteProvider(id);
      loadProviders();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  // Save edited provider
  const handleEditSave = async () => {
    try {
      await updateProvider(selectedProvider.id, selectedProvider);
      setEditDialogOpen(false);
      setSelectedProvider(null);
      loadProviders();
    } catch (error) {
      console.error('Failed to save provider:', error);
    }
  };

  // Add new provider
  const handleAddProvider = async () => {
    try {
      await addProvider(newProvider);
      setAddDialogOpen(false);
      setNewProvider({ name: '', email: '', service: '', location: '' });
      loadProviders();
    } catch (error) {
      console.error('Failed to add provider:', error);
    }
  };

  // View provider profile
  const handleViewProfile = async (id: number) => {
    setProfileLoading(true);
    setProfileDialogOpen(true);
    try {
      const response = await fetchProviderDetails(id);
      setProviderProfile(response.data);
    } catch (error) {
      console.error('Failed to load profile:', error);
      setProviderProfile(null);
    }
    setProfileLoading(false);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'service', headerName: 'Service', flex: 1 },
    { field: 'location', headerName: 'Location', flex: 1 },
    { field: 'status', headerName: 'Status', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 260,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => handleApprove(params.row.id)} color="success" title="Approve">
            <CheckCircle />
          </IconButton>
          <IconButton onClick={() => handleBlock(params.row.id)} color="warning" title="Block">
            <Block />
          </IconButton>
          <IconButton onClick={() => handleEdit(params.row)} color="primary" title="Edit">
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)} color="error" title="Delete">
            <Delete />
          </IconButton>
          <IconButton onClick={() => handleViewProfile(params.row.id)} color="info" title="View Profile">
            <Visibility />
          </IconButton>
        </Stack>
      )
    }
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Provider Management</Typography>
      <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => setAddDialogOpen(true)}>
        Add Provider
      </Button>

      {loading ? (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <div style={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={providers}
            columns={columns}
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: { paginationModel: { pageSize: 5, page: 0 } },
            }}
          />
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Provider</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={selectedProvider?.name || ''}
            onChange={(e) =>
              setSelectedProvider({ ...selectedProvider, name: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={selectedProvider?.email || ''}
            onChange={(e) =>
              setSelectedProvider({ ...selectedProvider, email: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Service"
            fullWidth
            value={selectedProvider?.service || ''}
            onChange={(e) =>
              setSelectedProvider({ ...selectedProvider, service: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Location"
            fullWidth
            value={selectedProvider?.location || ''}
            onChange={(e) =>
              setSelectedProvider({ ...selectedProvider, location: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add Provider</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={newProvider.name}
            onChange={(e) =>
              setNewProvider({ ...newProvider, name: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={newProvider.email}
            onChange={(e) =>
              setNewProvider({ ...newProvider, email: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Service"
            fullWidth
            value={newProvider.service}
            onChange={(e) =>
              setNewProvider({ ...newProvider, service: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Location"
            fullWidth
            value={newProvider.location}
            onChange={(e) =>
              setNewProvider({ ...newProvider, location: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddProvider} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Profile Dialog */}
      <Dialog
        open={profileDialogOpen}
        onClose={() => setProfileDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Provider Profile</DialogTitle>
        <DialogContent>
          {profileLoading ? (
            <Box textAlign="center" my={3}>
              <CircularProgress />
            </Box>
          ) : providerProfile ? (
            <>
              <Typography variant="h6">{providerProfile.name}</Typography>
              <Typography>Email: {providerProfile.email}</Typography>
              <Typography>Status: {providerProfile.status}</Typography>
              <Typography>Availability: {providerProfile.availability}</Typography>
              <Typography>Service: {providerProfile.service}</Typography>
              <Typography>Location: {providerProfile.location}</Typography>

              <Typography variant="subtitle1" mt={2}>Completed Services</Typography>
              <Typography>{providerProfile.completedServicesCount}</Typography>

              <Typography variant="subtitle1" mt={2}>Bookings</Typography>
              {providerProfile.bookings?.length > 0 ? (
                providerProfile.bookings.map((booking: any) => (
                  <Box key={booking.id} mb={1}>
                    <Typography>- {booking.service} on {booking.date} ({booking.status})</Typography>
                  </Box>
                ))
              ) : (
                <Typography>No bookings found</Typography>
              )}

              <Typography variant="subtitle1" mt={2}>Ratings & Reviews</Typography>
              {providerProfile.ratings?.length > 0 ? (
                providerProfile.ratings.map((rating: any, idx: number) => (
                  <Box key={idx} mb={1}>
                    <Typography>Rating: {'⭐'.repeat(rating.score)}</Typography>
                    <Typography>Comment: {rating.comment}</Typography>
                  </Box>
                ))
              ) : (
                <Typography>No ratings found</Typography>
              )}
            </>
          ) : (
            <Typography>No profile data available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProfileDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProviderManagement;
