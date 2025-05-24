import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  CircularProgress,
  Tooltip,
  Chip,
  InputAdornment,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  PersonAdd,
  Visibility,
  Block,
  CheckCircle,
  Search,
} from '@mui/icons-material';
import { useEffect, useState, } from 'react';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: string;
}

const UsersManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    status: 'active',
    password: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
  setLoading(true);
  try {
    const res = await axios.get("http://localhost:8000/api/users");
    console.log('Fetched users:', res.data);
    // Extract users array from the response object
    const data = res.data as { users: User[] };
    const usersArray = data.users || [];
    setUsers(usersArray);
  } catch (err) {
    console.error('Fetch users error:', err);
  }
  setLoading(false);
};


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAddOrEditUser = async () => {
    try {
      if (editMode && selectedUser) {
        const res = await axios.put<User>(`http://localhost:8000/api/users/${selectedUser.id}`, newUser);
        setUsers(users.map(u => u.id === selectedUser.id ? res.data : u));
      } else {
        const res = await axios.post<User>('http://localhost:8000/api/users', newUser);
        setUsers([...users, res.data]);
      }
      setOpenDialog(false);
      setNewUser({ name: '', email: '', phone: '', location: '', status: 'active' , password: '' });
      setEditMode(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('Error adding/editing user:', err);
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setNewUser({ ...user, password: '' });
    setEditMode(true);
    setOpenDialog(true);
  };

  const toggleStatus = async (user: User) => {
    try {
      const newStatus = user.status === 'active' ? 'blocked' : 'active';
      const res = await axios.patch<{ data: User }>(`http://localhost:8000/api/users/${user.id}/status`, { status: newStatus });
      setUsers(users.map(u => u.id === user.id ? res.data.data : u));
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery) ||
    user.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold" color="green">User Management</Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
          />
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            sx={{ backgroundColor: 'green', '&:hover': { backgroundColor: 'darkgreen' } }}
            onClick={() => {
              setOpenDialog(true);
              setEditMode(false);
              setNewUser({ name: '', email: '', phone: '', location: '', status: 'active', password: ''});
            }}
          >
            Add User
          </Button>
        </Box>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ backgroundColor: '#e8f5e9' }}>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Phone</strong></TableCell>
                <TableCell><strong>Location</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.location}</TableCell>
                    
                    <TableCell>
                    {/* Password should not be displayed */}
                    <Chip
                      label={user.status}
                      color={user.status === 'active' ? 'success' : 'error'}
                      size="small"
                    />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Profile"><IconButton color="primary"><Visibility /></IconButton></Tooltip>
                      <Tooltip title="Edit"><IconButton color="info" onClick={() => handleEditClick(user)}><Edit /></IconButton></Tooltip>
                      <Tooltip title={user.status === 'active' ? 'Block' : 'Unblock'}>
                        <IconButton color={user.status === 'active' ? 'error' : 'success'} onClick={() => toggleStatus(user)}>
                          {user.status === 'active' ? <Block /> : <CheckCircle />}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={6}>No users available.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>{editMode ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Name" fullWidth name="name" value={newUser.name} onChange={handleInputChange} />
          <TextField margin="dense" label="Email" fullWidth name="email" value={newUser.email} onChange={handleInputChange} />

          <TextField margin="dense" label="Phone" fullWidth name="phone" value={newUser.phone} onChange={handleInputChange} />
          <TextField margin="dense" label="Location" fullWidth name="location" value={newUser.location} onChange={handleInputChange} />
           <TextField margin="dense" label="Location" fullWidth name="password" value={newUser.location} onChange={handleInputChange} />
            
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" sx={{ backgroundColor: 'green' }} onClick={handleAddOrEditUser}>{editMode ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersManagement;
