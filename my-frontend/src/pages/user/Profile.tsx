import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Chip,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Snackbar,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  role: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  // Add provider-specific fields if needed
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [avatarMenuAnchor, setAvatarMenuAnchor] = useState<null | HTMLElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/profile", {
          headers: { Authorization: token ? `Bearer ${token}` : undefined },
          withCredentials: true,
        });
        const user = res.data as UserProfile;
        setProfile(user);
        setEditedProfile(user);
      } catch (err: any) {
        setError("Failed to load your profile information.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedProfile(profile);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedProfile(profile);
  };

  const handleSaveEdit = async () => {
    if (editedProfile) {
      setSaving(true);
      try {
        const response = await axios.put<{message: string, user: UserProfile}>(
          "http://localhost:8000/api/profile",
          {
            name: editedProfile.name,
            email: editedProfile.email,
            phone: editedProfile.phone,
           // location: editedProfile.location,
          },
          { withCredentials: true }
        );
        
        setProfile(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setIsEditing(false);
        setSuccessMessage("Profile updated successfully!");
      } catch (err: any) {
        console.error("Error saving profile:", err);
        setError(err.response?.data?.message || "Failed to save your profile information.");
      } finally {
        setSaving(false);
      }
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        [field]: value
      });
    }
  };

  const handleAvatarMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAvatarMenuAnchor(event.currentTarget);
  };

  const handleAvatarMenuClose = () => {
    setAvatarMenuAnchor(null);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
    handleAvatarMenuClose();
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
    handleAvatarMenuClose();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate("/login")}
          sx={{ mt: 2 }}
        >
          Go to Login
        </Button>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box p={3}>
        <Typography variant="h6" color="text.secondary">
          No profile information available.
        </Typography>
      </Box>
    );
  }

  const currentProfile = isEditing ? editedProfile : profile;

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Profile Overview
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Profile Header */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={3}>
            <Box position="relative">
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: "#147c3c",
                  fontSize: "2rem",
                  cursor: "pointer",
                }}
                src={avatarUrl}
                onClick={handleAvatarMenuOpen}
              >
                {currentProfile?.name?.charAt(0) || "U"}
              </Avatar>
              <IconButton
                size="small"
                sx={{
                  position: "absolute",
                  bottom: -5,
                  right: -5,
                  bgcolor: "white",
                  border: "2px solid #147c3c",
                  "&:hover": { bgcolor: "white" },
                }}
                onClick={handleAvatarMenuOpen}
              >
                <EditIcon fontSize="small" sx={{ color: "#147c3c" }} />
              </IconButton>
            </Box>
            <Box flex={1}>
              <Typography variant="h5" fontWeight={600}>
                {currentProfile?.name}
              </Typography>
            </Box>
            <Box>
              {!isEditing ? (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleEditClick}
                  sx={{ color: "#147c3c", borderColor: "#147c3c" }}
                >
                  Edit Profile
                </Button>
              ) : (
                <Box display="flex" gap={1}>
                  <Button
                    variant="contained"
                    startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
                    onClick={handleSaveEdit}
                    disabled={saving}
                    sx={{ bgcolor: "#147c3c" }}
                  >
                    {saving ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Profile Details and Account Information */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Profile Details */}
          <Card elevation={2} sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Personal Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <PersonIcon color="action" />
                <Box flex={1}>
                  <Typography variant="body2" color="text.secondary">
                    Full Name
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      size="small"
                      value={currentProfile?.name || ""}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      sx={{ mt: 0.5 }}
                    />
                  ) : (
                    <Typography variant="body1">
                      {currentProfile?.name}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <EmailIcon color="action" />
                <Box flex={1}>
                  <Typography variant="body2" color="text.secondary">
                    Email Address
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      size="small"
                      value={currentProfile?.email || ""}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      sx={{ mt: 0.5 }}
                    />
                  ) : (
                    <Typography variant="body1">{currentProfile?.email}</Typography>
                  )}
                </Box>
              </Box>

              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <PhoneIcon color="action" />
                <Box flex={1}>
                  <Typography variant="body2" color="text.secondary">
                    Phone Number
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      size="small"
                      value={currentProfile?.phone || ""}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Enter phone number"
                      sx={{ mt: 0.5 }}
                    />
                  ) : (
                    <Typography variant="body1">
                      {currentProfile?.phone || "Not provided"}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box display="flex" alignItems="center" gap={2}>
                <LocationOnIcon color="action" />
                <Box flex={1}>
                  <Typography variant="body2" color="text.secondary">
                    Location
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      size="small"
                      value={currentProfile?.location || ""}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="Enter location"
                      sx={{ mt: 0.5 }}
                    />
                  ) : (
                    <Typography variant="body1">
                      {currentProfile?.location || "Not provided"}
                    </Typography>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card elevation={2} sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Account Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Role
                </Typography>
                <Typography variant="body1" fontWeight={500} sx={{ textTransform: 'capitalize' }}>
                  {currentProfile?.role}
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Member Since
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {currentProfile?.created_at ? 
                    new Date(currentProfile.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 
                    'Information not available'
                  }
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Account Status
                </Typography>
                <Chip
                  label="Active"
                  color="success"
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Avatar Menu */}
      <Menu
        anchorEl={avatarMenuAnchor}
        open={Boolean(avatarMenuAnchor)}
        onClose={handleAvatarMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={handleCameraClick}>
          <ListItemIcon>
            <CameraAltIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Take Photo</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleBrowseClick}>
          <ListItemIcon>
            <PhotoLibraryIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Browse Files</ListItemText>
        </MenuItem>
      </Menu>

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleCameraCapture}
      />

      {/* Success Notification */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage("")}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSuccessMessage("")} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
