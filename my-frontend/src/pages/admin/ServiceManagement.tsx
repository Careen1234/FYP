import React, { useEffect, useState } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, InputAdornment, MenuItem, Paper, Pagination,
  Switch, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Typography, CircularProgress
} from '@mui/material';
import { Add, Delete, Edit, Search } from '@mui/icons-material';
import axios from 'axios';

interface Service {
  id: number;
  name: string;
  description?: string;
  service_category_id: number | string;
  status: boolean;
  bookings_count: number;
  photo?: string;
}

interface Category {
  id: number;
  category: string;
}

interface FormState {
  name: string;
  description: string;
  service_category_id: string;
  status: boolean;
  photo?: File;
  photo_url?: string;
}

const ServicesManagement: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [editService, setEditService] = useState<Service | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [form, setForm] = useState<FormState>({
    name: '',
    description: '',
    service_category_id: '',
    status: true,
  });

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, [page, searchTerm]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/api/services', {
        params: { page, search: searchTerm },
      });
      const result = res.data as { data: Service[]; last_page?: number };
      setServices(Array.isArray(result.data) ? result.data : []);
      setTotalPages(result.last_page || 1);
    } catch (err) {
      console.error('Fetch services error', err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/service-categories');
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Fetch categories error', err);
      setCategories([]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('service_category_id', form.service_category_id);
    formData.append('status', String(form.status));

    if (form.photo) {
      formData.append('photo', form.photo);
    }

    try {
      if (editService) {
        await axios.post(`http://localhost:8000/api/services/${editService.id}?_method=PUT`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post('http://localhost:8000/api/services', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      fetchServices();
      handleClose();
    } catch (err) {
      console.error('Save error', err);
    }
  };

  const handleStatusToggle = async (id: number, current: boolean) => {
    try {
      await axios.put(`http://localhost:8000/api/services/${id}`, { status: !current });
      fetchServices();
    } catch (err) {
      console.error('Toggle error', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        await axios.delete(`http://localhost:8000/api/services/${id}`);
        fetchServices();
      } catch (err) {
        console.error('Delete error', err);
      }
    }
  };

  const handleEdit = (service: Service) => {
    setEditService(service);
    setForm({
      name: service.name,
      description: service.description || '',
      service_category_id: service.service_category_id.toString(),
      status: service.status,
      photo: undefined,
      photo_url: service.photo ? `http://localhost:8000/storage/${service.photo}` : undefined
    });
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setEditService(null);
    setForm({
      name: '',
      description: '',
      service_category_id: '',
      status: true,
      photo: undefined,
      photo_url: undefined
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  return (
    <Box sx={{ padding: 6 }}>
      <Typography variant="h5" sx={{ color: '#147c3c', mb: 2 }}>
        SERVICES MANAGEMENT
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          placeholder="Search by name or category..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />

        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ backgroundColor: '#147c3c', '&:hover': { backgroundColor: '#147c3c' } }}
          onClick={() => setOpenDialog(true)}
        >
          Add Service
        </Button>
      </Box>

      {loading ? (
        <CircularProgress color="success" />
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#147c3c' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>ID</TableCell>
                  <TableCell sx={{ color: 'white' }}>Name</TableCell>
                  <TableCell sx={{ color: 'white' }}>Category</TableCell>
                  <TableCell sx={{ color: 'white' }}>Photo</TableCell>
                  <TableCell sx={{ color: 'white' }}>Status</TableCell>
                  <TableCell sx={{ color: 'white' }}>Bookings</TableCell>
                  <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(services || []).map(service => (
                  <TableRow key={service.id}>
                    <TableCell>{service.id}</TableCell>
                    <TableCell>{service.name}</TableCell>
                    <TableCell>
                      {categories.find(cat => cat.id === Number(service.service_category_id))?.category || '-'}
                    </TableCell>
                    <TableCell>
                      {service.photo ? (
                        <img
                          src={`http://localhost:8000/storage/${service.photo}`}
                          alt={service.name}
                          style={{
                            width: 50,
                            height: 50,
                            objectFit: 'cover',
                            borderRadius: 4
                          }}
                        />
                      ) : 'No photo'}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={service.status}
                        onChange={() => handleStatusToggle(service.id, service.status)}
                        color="success"
                      />
                    </TableCell>
                    <TableCell>{service.bookings_count}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(service)} color="success">
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(service.id)} color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="standard"
            />
          </Box>
        </>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#147c3c', color: 'white' }}>
          {editService ? 'Edit Service' : 'Add Service'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Upload Photo"
            type="file"
            fullWidth
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.files?.[0]) {
                setForm(prev => ({
                  ...prev,
                  photo: e.target.files![0],
                  photo_url: URL.createObjectURL(e.target.files![0])
                }));
              }
            }}
            inputProps={{ accept: 'image/*' }}
            sx={{ mb: 2 }}
          />

          {(form.photo_url) && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Photo Preview:</Typography>
              <img
                src={form.photo_url}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: 200,
                  marginTop: 8,
                  borderRadius: 4
                }}
              />
            </Box>
          )}

          <TextField
            label="Category"
            name="service_category_id"
            value={form.service_category_id}
            onChange={handleChange}
            fullWidth
            select
            sx={{ mb: 2 }}
            required
          >
            <MenuItem value="">Select a category</MenuItem>
            {(categories || []).map(cat => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.category}
              </MenuItem>
            ))}
          </TextField>

          <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ mr: 2 }}>Status:</Typography>
            <Switch
              checked={form.status}
              onChange={(e) => setForm(prev => ({ ...prev, status: e.target.checked }))}
              color="success"
            />
            <Typography variant="body2">
              {form.status ? 'Active' : 'Inactive'}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ backgroundColor: '#147c3c', '&:hover': { backgroundColor: '#0f5d2d' } }}
          >
            {editService ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ServicesManagement;
