import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  Stack,
  Chip,
  Paper,
  CircularProgress,
  Alert,
  InputAdornment
} from '@mui/material';
import {
  Edit as EditIcon,
  Check as CheckIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  AddPhotoAlternate as AddPhotoIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  Language as WebsiteIcon,
  AttachMoney as PriceIcon
} from '@mui/icons-material';
import axios from 'axios';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  service: string;
  price: string;
  bio: string;
  profilePhoto: string | null; // for preview URL
  instagram: string;
  facebook: string;
  website: string;
}

interface ProviderApiResponse {
  business_name: string;
  business_email: string;
  business_phone: string;
  service_category?: { name: string };
  price: number | string;
  bio: string;
  profile_photo_url: string | null;
  instagram: string;
  facebook: string;
  website: string;
}

const ProviderProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const profileInputRef = useRef<HTMLInputElement>(null);

  const greenColor = '#147c3c';
  const greenHover = '#126e35';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get<ProviderApiResponse>('http://localhost:8000/api/providers/profile', {
          withCredentials: true,
        });
        const data = response.data;
        setProfile({
          name: data.business_name || '',
          email: data.business_email || '',
          phone: data.business_phone || '',
          service: data.service_category?.name || '',
          price: data.price ? data.price.toString() : '',
          bio: data.bio || '',
          profilePhoto: data.profile_photo_url || null,
          instagram: data.instagram || '',
          facebook: data.facebook || '',
          website: data.website || '',
        });
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!profile) return;

    if (!profile.name.trim()) {
      alert('Business Name is required.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', profile.name);
      formData.append('email', profile.email);
      formData.append('phone', profile.phone);
      formData.append('bio', profile.bio);
      formData.append('price', profile.price);
      formData.append('instagram', profile.instagram);
      formData.append('facebook', profile.facebook);
      formData.append('website', profile.website);

      if (profileInputRef.current?.files?.[0]) {
        formData.append('profile_photo', profileInputRef.current.files[0]);
      }

      await axios.patch('http://localhost:8000/api/providers/profile', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setIsEditing(false);
    } catch (err: any) {
      console.error('Failed to save profile:', err.response?.data || err.message);
      alert('Failed to save profile.');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file && profile) {
      // Show local preview URL
      setProfile({ ...profile, profilePhoto: URL.createObjectURL(file) });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !profile) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error || 'Could not load profile.'}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
      }}
    >
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
              '&:hover': { backgroundColor: greenHover, color: '#fff', borderColor: greenHover },
            }}
          >
            Edit Profile
          </Button>
        )}
      </Stack>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="flex-start">
          <Stack alignItems="center" spacing={2} sx={{ minWidth: '200px' }}>
            <Avatar
              src={profile.profilePhoto || undefined}
              sx={{
                width: 150,
                height: 150,
                bgcolor: greenColor,
                fontSize: 60,
              }}
            >
              {profile.name ? profile.name.charAt(0) : ''}
            </Avatar>

            {isEditing && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  ref={profileInputRef}
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
                <Button
                  variant="outlined"
                  startIcon={<AddPhotoIcon />}
                  onClick={() => profileInputRef.current?.click()}
                  sx={{
                    borderColor: greenColor,
                    color: greenColor,
                    '&:hover': { backgroundColor: greenHover, color: '#fff', borderColor: greenHover },
                  }}
                >
                  Upload Photo
                </Button>
              </>
            )}
          </Stack>

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
                backgroundColor: 'transparent',
              }}
              variant="outlined"
            />

            <Stack direction="row" spacing={2} alignItems="center" mb={1}>
              <EmailIcon color="action" />
              {isEditing ? (
                <TextField
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  size="small"
                  fullWidth
                />
              ) : (
                <Typography>{profile.email}</Typography>
              )}
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center" mb={3}>
              <PhoneIcon color="action" />
              {isEditing ? (
                <TextField
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  size="small"
                  fullWidth
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
                  endAdornment: <InputAdornment position="end">Tsh/hr</InputAdornment>,
                  startAdornment: <PriceIcon color="action" sx={{ mr: 1 }} />,
                }}
                fullWidth
                margin="normal"
              />
            ) : (
              <Chip
                icon={<PriceIcon />}
                label={`Service Rate: ${profile.price} Tsh/hr`}
                sx={{
                  mb: 2,
                  color: greenColor,
                  borderColor: greenColor,
                  borderWidth: 1,
                  borderStyle: 'solid',
                  backgroundColor: 'transparent',
                }}
                variant="outlined"
              />
            )}

            {isEditing ? (
              <TextField
                label="Bio"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                multiline
                rows={4}
                fullWidth
                margin="normal"
              />
            ) : (
              <Typography variant="body1" color="text.secondary">
                {profile.bio}
              </Typography>
            )}

            <Box mt={3}>
              <Typography variant="subtitle1" gutterBottom>
                Social Media
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                <InstagramIcon color="action" />
                {isEditing ? (
                  <TextField
                    placeholder="Instagram URL"
                    value={profile.instagram}
                    onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                    size="small"
                    fullWidth
                  />
                ) : profile.instagram ? (
                  <a href={profile.instagram} target="_blank" rel="noopener noreferrer">
                    {profile.instagram}
                  </a>
                ) : (
                  <Typography color="text.secondary">Not provided</Typography>
                )}
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                <FacebookIcon color="action" />
                {isEditing ? (
                  <TextField
                    placeholder="Facebook URL"
                    value={profile.facebook}
                    onChange={(e) => setProfile({ ...profile, facebook: e.target.value })}
                    size="small"
                    fullWidth
                  />
                ) : profile.facebook ? (
                  <a href={profile.facebook} target="_blank" rel="noopener noreferrer">
                    {profile.facebook}
                  </a>
                ) : (
                  <Typography color="text.secondary">Not provided</Typography>
                )}
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                <WebsiteIcon color="action" />
                {isEditing ? (
                  <TextField
                    placeholder="Website URL"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    size="small"
                    fullWidth
                  />
                ) : profile.website ? (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer">
                    {profile.website}
                  </a>
                ) : (
                  <Typography color="text.secondary">Not provided</Typography>
                )}
              </Stack>
            </Box>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default ProviderProfile;
