import React, { useEffect, useState, type ChangeEvent } from "react";
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
  Typography,
  InputAdornment,
  Box,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { Search, Add } from "@mui/icons-material";

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
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);

  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>({
    name: "",
    email: "",
    phone: "",
    location: "",
    password: "",
    password_confirmation: "",
  });

  const fetchUsers = async () => {
    try {
      const response = await axios.get<{ users: User[] }>("http://localhost:8000/api/users");
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (editMode && currentUser.id !== undefined) {
        await axios.put(`http://localhost:8000/api/users/${currentUser.id}`, currentUser);
      } else {
        await axios.post("http://localhost:8000/api/users", currentUser);
      }
      setOpenFormDialog(false);
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

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

  const handleViewProfile = (user: User) => {
    setSelectedUser(user);
    setOpenProfileDialog(true);
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenForm = (user?: User) => {
    if (user) {
      setCurrentUser({ ...user, password: "", password_confirmation: "" });
      setEditMode(true);
    } else {
      setCurrentUser({
        name: "",
        email: "",
        phone: "",
        location: "",
        password: "",
        password_confirmation: "",
      });
      setEditMode(false);
    }
    setOpenFormDialog(true);
  };

  const handleCloseForm = () => setOpenFormDialog(false);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" sx={{ color: '#2E7D32', mb: 2 }}>
        Users Management
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          placeholder="Search by name ..."
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
          sx={{ backgroundColor: '#2E7D32', '&:hover': { backgroundColor: '#27642a' } }}
          onClick={() => handleOpenForm()}
        >
          Add User
        </Button>
      </Box>

      <Table>
        <TableHead sx={{ backgroundColor: '#2E7D32' }}>
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
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.location}</TableCell>
              <TableCell>{user.status === 0 ? "Blocked" : "Active"}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleOpenForm(user)} title="Edit">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(user.id)} title="Delete" color="error">
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleBlockToggle(user.id)}
                  title={user.status === 0 ? "Unblock" : "Block"}
                  color="secondary"
                >
                  {user.status === 0 ? <LockOpenIcon /> : <BlockIcon />}
                </IconButton>
                <IconButton onClick={() => handleViewProfile(user)} title="View Profile">
                  <VisibilityIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Profile Dialog */}
      <Dialog open={openProfileDialog} onClose={() => setOpenProfileDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>User Profile</DialogTitle>
        <DialogContent>
          {selectedUser ? (
            <Box>
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Phone:</strong> {selectedUser.phone || 'N/A'}</p>
              <p><strong>Location:</strong> {selectedUser.location || 'N/A'}</p>
              <p><strong>Status:</strong> {selectedUser.status === 0 ? 'Blocked' : 'Active'}</p>
            </Box>
          ) : (
            <p>No user selected</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProfileDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit User Dialog */}
      <Dialog open={openFormDialog} onClose={handleCloseForm}>
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
          {!editMode && (
            <TextField
              margin="dense"
              label="Confirm Password"
              name="password_confirmation"
              type="password"
              value={currentUser.password_confirmation}
              onChange={handleInputChange}
              fullWidth
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            {editMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersManagement;
