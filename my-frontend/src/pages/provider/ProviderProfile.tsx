import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  Divider,
  Stack,
  Chip,
  Paper,
  IconButton
} from '@mui/material';
import {
  Edit as EditIcon,
  Check as CheckIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  AddPhotoAlternate as AddPhotoIcon,
  AttachMoney as PriceIcon
} from '@mui/icons-material';

const ProviderProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'AquaFlow Plumbing',
    email: 'contact@aquaflow.com',
    phone: '(555) 123-4567',
    service: 'Residential Plumbing',
    price: '$85/hr',
    bio: 'Specializing in leak repairs, pipe installations, and emergency plumbing services.',
    profilePhoto: null,
    businessPhotos: []
  });

  const profileInputRef = useRef();
  const businessInputRef = useRef();

  const greenColor = '#147c3c';
  const greenHover = '#126e35';

  const handleSave = () => {
    setIsEditing(false);
    // API save logic would go here
  };

  const handlePhotoUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === 'profile') {
          setProfile({ ...profile, profilePhoto: reader.result });
        } else {
          setProfile({ ...profile, businessPhotos: [...profile.businessPhotos, reader.result] });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ 
      p: { xs: 2, md: 3 }, 
      backgroundColor: '#f5f5f5', // light gray
      minHeight: '100vh' 
    }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h5" fontWeight={600}>
          Business Profile
        </Typography>
        {isEditing ? (
          <Button
            variant="contained"
            startIcon={<CheckIcon />}
            onClick={handleSave}
            sx={{ backgroundColor: greenColor, '&:hover': { backgroundColor: greenHover } }}
          >
            Save Profile
          </Button>
        ) : (
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => setIsEditing(true)}
            sx={{
              borderColor: greenColor,
              color: greenColor,
              '&:hover': { backgroundColor: greenHover, color: '#fff', borderColor: greenHover }
            }}
          >
            Edit Profile
          </Button>
        )}
      </Stack>

      {/* Profile Info */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="flex-start">
          {/* Avatar */}
          <Stack alignItems="center" spacing={2} sx={{ minWidth: '200px' }}>
            <Avatar
              src={profile.profilePhoto}
              sx={{
                width: 150,
                height: 150,
                bgcolor: greenColor,
                fontSize: 60
              }}
            >
              {profile.name.charAt(0)}
            </Avatar>

            {isEditing && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  ref={profileInputRef}
                  onChange={(e) => handlePhotoUpload(e, 'profile')}
                  style={{ display: 'none' }}
                />
                <Button
                  variant="outlined"
                  startIcon={<AddPhotoIcon />}
                  onClick={() => profileInputRef.current.click()}
                  sx={{
                    borderColor: greenColor,
                    color: greenColor,
                    '&:hover': { backgroundColor: greenHover, color: '#fff', borderColor: greenHover }
                  }}
                >
                  Upload Photo
                </Button>
              </>
            )}
          </Stack>

          {/* Business Info */}
          <Box sx={{ flexGrow: 1 }}>
            {isEditing ? (
              <TextField
                label="Business Name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                fullWidth
                margin="normal"
              />
            ) : (
              <Typography variant="h4" gutterBottom>
                {profile.name}
              </Typography>
            )}

            <Chip
              icon={<WorkIcon />}
              label={profile.service}
              sx={{
                mb: 2,
                color: greenColor,
                borderColor: greenColor,
                borderWidth: 1,
                borderStyle: 'solid',
                backgroundColor: 'transparent'
              }}
              variant="outlined"
            />

            <Stack direction="row" spacing={2} alignItems="center" mb={1}>
              <EmailIcon color="action" />
              <Typography>{profile.email}</Typography>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center" mb={3}>
              <PhoneIcon color="action" />
              {isEditing ? (
                <TextField
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  size="small"
                />
              ) : (
                <Typography>{profile.phone}</Typography>
              )}
            </Stack>

            {isEditing ? (
              <TextField
                label="Service Price"
                value={profile.price}
                onChange={(e) => setProfile({ ...profile, price: e.target.value })}
                InputProps={{
                  startAdornment: <PriceIcon color="action" sx={{ mr: 1 }} />
                }}
                fullWidth
                margin="normal"
              />
            ) : (
              <Chip
                icon={<PriceIcon />}
                label={`Service Rate: ${profile.price}`}
                sx={{
                  mb: 2,
                  color: greenColor,
                  borderColor: greenColor,
                  borderWidth: 1,
                  borderStyle: 'solid',
                  backgroundColor: 'transparent'
                }}
                variant="outlined"
              />
            )}
          </Box>
        </Stack>
      </Paper>

      {/* Business Photos */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Business Photos
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Showcase your work to customers
        </Typography>

        {isEditing && (
          <>
            <input
              type="file"
              accept="image/*"
              ref={businessInputRef}
              onChange={(e) => handlePhotoUpload(e, 'business')}
              style={{ display: 'none' }}
              multiple
            />
            <Button
              variant="outlined"
              startIcon={<AddPhotoIcon />}
              onClick={() => businessInputRef.current.click()}
              sx={{
                mb: 3,
                borderColor: greenColor,
                color: greenColor,
                '&:hover': { backgroundColor: greenHover, color: '#fff', borderColor: greenHover }
              }}
            >
              Add Business Photos
            </Button>
          </>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
            gap: 2
          }}
        >
          {profile.businessPhotos.map((photo, index) => (
            <Box
              key={index}
              sx={{
                height: '200px',
                borderRadius: 1,
                overflow: 'hidden',
                position: 'relative',
                bgcolor: 'grey.100'
              }}
            >
              <img
                src={photo}
                alt={`Business work ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Bio Section */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          About Your Business
        </Typography>
        {isEditing ? (
          <TextField
            label="Business Description"
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            multiline
            rows={4}
            fullWidth
          />
        ) : (
          <Typography color="text.secondary">{profile.bio}</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ProviderProfile;
