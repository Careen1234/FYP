import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,


} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

interface User {
  id?: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  status?: number;
  password?: string;
  password_confirmation?: string;
}

const UsersManagement: React.FC = () => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [openProfileDialog, setOpenProfileDialog] = useState(false);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>({
    name: "",
    email: "",
    phone: "",
    location: "",
    password: "",
    
  });

  const fetchUsers = async () => {
    try {
      const response = await axios.get<{ users: User[] }>("http://localhost:8000/api/users");
      setUsers(response.data.users); // ✅ fix: use response.data.users
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setCurrentUser((prev) => ({ ...prev, [name]: value }));
  };

  
  
    const handleSubmit = async () => {
      try {
        if (editMode && currentUser.id !== undefined) {
          await axios.put(`http://localhost:8000/api/users/${currentUser.id}`, currentUser);
          setSnackbar({ open: true, message: 'User updated', severity: 'success' });
        } else {
          await axios.post('http://localhost:8000/api/users', currentUser);
          setSnackbar({ open: true, message: 'User added', severity: 'success' });
        }
        setOpen(false);
        fetchUsers();
      } catch (error) {
        setSnackbar({ open: true, message: 'Error saving user', severity: 'error' });
      }
    }

  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      await axios.delete(`http://localhost:8000/api/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleBlockToggle = async (id?: number) => {
    if (!id) return;
    try {
      await axios.put(`http://localhost:8000/api/users/${id}/toggle-block`);
      fetchUsers();
    } catch (error) {
      console.error("Error toggling user status:", error);
    }
  };

// Dummy implementation for handleViewProfile to fix the error
const handleViewProfile = (user: User) => {
  setSelectedUser(user);
  setOpenProfileDialog(true);
  setSnackbar({ open: true, message: `Viewing profile for ${user.name}`, severity: 'success' });
};

  const handleOpen = (user: User) => {
    setCurrentUser({
      name: "",
      email: "",
      phone: "",
      location: "",
      password: "",
      
    });
    setEditMode(false);
    setOpen(true);
  };

  const handleEdit = (user: User) => {
    setCurrentUser({
      ...user,
      
      password: "",
      
    });
    setEditMode(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>User Management</h2>
      <Button variant="contained" color="success" onClick={() => handleOpen({
        name: "",
        email: "",
        phone: "",
        location: "",
        password: "",
      })}>
        Add User
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.location}</TableCell>
              <TableCell>{user.status === 1 ? "Active" : "Active"}</TableCell>
              <TableCell>
                  
                  
                  

                  <IconButton
                    aria-label="edit"
                    onClick={() => handleOpen(user)}
                    title="Edit"
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    aria-label="delete"
                    color="error"
                    onClick={() => handleDelete(user.id)}
                    title="Delete"
                  >
                    <DeleteIcon />
                  </IconButton>

                  <IconButton
                    aria-label={user.status === 0 ? 'unblock' : 'block'}
                    color="secondary"
                    onClick={() => handleBlockToggle(user.id)}
                    title={user.status === 0 ? 'Unblock' : 'Block'}
                  >
                    {user.status === 0 ? <LockOpenIcon /> : <BlockIcon />}
                  </IconButton>

                  <IconButton onClick={() => handleViewProfile(user)}>
                    <VisibilityIcon />
                  </IconButton>

                  
                </TableCell>
              </TableRow>
           
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            name="name"
            value={currentUser.name}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            value={currentUser.email}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Phone"
            name="phone"
            value={currentUser.phone}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Location"
            name="location"
            value={currentUser.location}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Password"
            name="password"
            type="password"
            value={currentUser.password}
            onChange={handleInputChange}
            fullWidth
          />
                 
         </DialogContent>

         <Dialog open={openProfileDialog} onClose={() => setOpenProfileDialog(false)} fullWidth maxWidth="sm">
  <DialogTitle>User Profile</DialogTitle>
  <DialogContent>
    {selectedUser ? (
      <div>
        <p><strong>Name:</strong> {selectedUser.name}</p>
        <p><strong>Email:</strong> {selectedUser.email}</p>
        <p><strong>Phone:</strong> {selectedUser.phone || 'N/A'}</p>
        <p><strong>Location:</strong> {selectedUser.location || 'N/A'}</p>
        <p><strong>Status:</strong> {selectedUser.status}</p>
        {/* Add any more fields as needed */}
      </div>
    ) : (
      <p>No user selected</p>
    )}
  </DialogContent>
</Dialog>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            {editMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UsersManagement;
