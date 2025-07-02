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
  InputAdornment,
  IconButton
} from '@mui/material';
import { Grid } from '@mui/material';
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
  AttachMoney as PriceIcon,
  Close as CloseIcon
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
  const [success, setSuccess] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const profileInputRef = useRef<HTMLInputElement>(null);

  const greenColor = '#147c3c';
  const lightGreen = '#e0f2e9';

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
      setError('Business Name is required');
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

      setSuccess(true);
      setIsEditing(false);
      setPhotoPreview(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Failed to save profile:', err.response?.data || err.message);
      setError('Failed to save profile. Please try again.');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file && profile) {
      // Show local preview URL
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    }
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    if (profileInputRef.current) {
      profileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <CircularProgress size={60} thickness={4} sx={{ color: greenColor }} />
      </Box>
    );
  }

  if (error || !profile) {
    return (
      <Box sx={{ p: 3, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto' }}>
          {error || 'Could not load profile.'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
      }}
    >
      <Paper sx={{ 
        p: { xs: 2, md: 4 }, 
        borderRadius: 3,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
        maxWidth: 1200,
        mx: 'auto'
      }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" fontWeight={700} color="#0d5a2c">
            Business Profile
          </Typography>
          
          {isEditing ? (
            <Button
              variant="contained"
              startIcon={<CheckIcon />}
              onClick={handleSave}
              sx={{ 
                backgroundColor: greenColor, 
                px: 3,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { 
                  backgroundColor: '#0d5a2c',
                  boxShadow: '0 4px 12px rgba(20, 124, 60, 0.25)'
                },
              }}
            >
              Save Changes
            </Button>
          ) : (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setIsEditing(true)}
              sx={{
                borderColor: greenColor,
                color: greenColor,
                px: 3,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { 
                  backgroundColor: lightGreen,
                  borderColor: greenColor,
                },
              }}
            >
              Edit Profile
            </Button>
          )}
        </Stack>

        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            Profile updated successfully!
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Left Column - Profile Photo */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ 
              p: 3, 
              borderRadius: 3,
              backgroundColor: '#fff',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.03)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={photoPreview || profile.profilePhoto || undefined}
                  sx={{
                    width: 180,
                    height: 180,
                    bgcolor: greenColor,
                    fontSize: 60,
                    border: '2px solid #e2e8f0',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  {profile.name ? profile.name.charAt(0) : ''}
                </Avatar>
                
                {(isEditing && photoPreview) && (
                  <IconButton
                    onClick={removePhoto}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: '#fff',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      '&:hover': {
                        backgroundColor: '#f1f5f9'
                      }
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>

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
                      mt: 3,
                      borderColor: greenColor,
                      color: greenColor,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 500,
                      '&:hover': { 
                        backgroundColor: lightGreen,
                        borderColor: greenColor,
                      },
                    }}
                  >
                    Upload New Photo
                  </Button>
                  <Typography variant="caption" color="textSecondary" mt={1}>
                    JPG, PNG or GIF (Max. 5MB)
                  </Typography>
                </>
              )}
              
              {!isEditing && profile.service && (
                <Chip
                  icon={<WorkIcon />}
                  label={profile.service}
                  sx={{
                    mt: 3,
                    color: greenColor,
                    borderColor: greenColor,
                    backgroundColor: lightGreen,
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    px: 1.5,
                    py: 1.5
                  }}
                  variant="outlined"
                />
              )}
            </Paper>
          </Grid>

          {/* Right Column - Profile Details */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ 
              p: 3, 
              borderRadius: 3,
              backgroundColor: '#fff',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.03)',
              height: '100%'
            }}>
              {/* Business Name & Service */}
              {isEditing ? (
                <>
                  <TextField
                    label="Business Name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    fullWidth
                    margin="normal"
                    InputProps={{
                      startAdornment: <WorkIcon sx={{ color: '#94a3b8', mr: 1 }} />
                    }}
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                  
                  <TextField
                    label="Service Category"
                    value={profile.service}
                    onChange={(e) => setProfile({ ...profile, service: e.target.value })}
                    fullWidth
                    margin="normal"
                    InputProps={{
                      startAdornment: <WorkIcon sx={{ color: '#94a3b8', mr: 1 }} />
                    }}
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </>
              ) : (
                <Box mb={3}>
                  <Typography variant="h5" fontWeight={700} color="#0d5a2c">
                    {profile.name}
                  </Typography>
                  {profile.service && (
                    <Typography variant="body1" color="#64748b" mt={0.5}>
                      {profile.service}
                    </Typography>
                  )}
                </Box>
              )}

              <Grid container spacing={2}>
                {/* Contact Info */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight={600} mb={2} color="#0d5a2c">
                    Contact Information
                  </Typography>
                  
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="caption" color="#64748b" display="block">
                        Email
                      </Typography>
                      {isEditing ? (
                        <TextField
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          fullWidth
                          size="small"
                          InputProps={{
                            startAdornment: <EmailIcon sx={{ color: '#94a3b8', mr: 1 }} />
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            }
                          }}
                        />
                      ) : (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <EmailIcon sx={{ color: '#94a3b8' }} />
                          <Typography>{profile.email}</Typography>
                        </Stack>
                      )}
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="#64748b" display="block">
                        Phone
                      </Typography>
                      {isEditing ? (
                        <TextField
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          fullWidth
                          size="small"
                          InputProps={{
                            startAdornment: <PhoneIcon sx={{ color: '#94a3b8', mr: 1 }} />
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            }
                          }}
                        />
                      ) : (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <PhoneIcon sx={{ color: '#94a3b8' }} />
                          <Typography>{profile.phone}</Typography>
                        </Stack>
                      )}
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="#64748b" display="block">
                        Service Price
                      </Typography>
                      {isEditing ? (
                        <TextField
                          value={profile.price}
                          onChange={(e) => setProfile({ ...profile, price: e.target.value })}
                          fullWidth
                          size="small"
                          InputProps={{
                            startAdornment: <PriceIcon sx={{ color: '#94a3b8', mr: 1 }} />,
                            endAdornment: <InputAdornment position="end">Tsh/hr</InputAdornment>
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            }
                          }}
                        />
                      ) : (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <PriceIcon sx={{ color: '#94a3b8' }} />
                          <Typography>{profile.price} Tsh/hr</Typography>
                        </Stack>
                      )}
                    </Box>
                  </Stack>
                </Grid>
                
                {/* Social Media */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight={600} mb={2} color="#0d5a2c">
                    Social Media
                  </Typography>
                  
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="caption" color="#64748b" display="block">
                        Instagram
                      </Typography>
                      {isEditing ? (
                        <TextField
                          placeholder="Instagram URL"
                          value={profile.instagram}
                          onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                          fullWidth
                          size="small"
                          InputProps={{
                            startAdornment: <InstagramIcon sx={{ color: '#94a3b8', mr: 1 }} />
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            }
                          }}
                        />
                      ) : profile.instagram ? (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <InstagramIcon sx={{ color: '#94a3b8' }} />
                          <a href={profile.instagram} target="_blank" rel="noopener noreferrer" style={{ color: greenColor }}>
                            {profile.instagram}
                          </a>
                        </Stack>
                      ) : (
                        <Typography color="textSecondary" variant="body2">
                          Not provided
                        </Typography>
                      )}
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="#64748b" display="block">
                        Facebook
                      </Typography>
                      {isEditing ? (
                        <TextField
                          placeholder="Facebook URL"
                          value={profile.facebook}
                          onChange={(e) => setProfile({ ...profile, facebook: e.target.value })}
                          fullWidth
                          size="small"
                          InputProps={{
                            startAdornment: <FacebookIcon sx={{ color: '#94a3b8', mr: 1 }} />
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            }
                          }}
                        />
                      ) : profile.facebook ? (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <FacebookIcon sx={{ color: '#94a3b8' }} />
                          <a href={profile.facebook} target="_blank" rel="noopener noreferrer" style={{ color: greenColor }}>
                            {profile.facebook}
                          </a>
                        </Stack>
                      ) : (
                        <Typography color="textSecondary" variant="body2">
                          Not provided
                        </Typography>
                      )}
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="#64748b" display="block">
                        Website
                      </Typography>
                      {isEditing ? (
                        <TextField
                          placeholder="Website URL"
                          value={profile.website}
                          onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                          fullWidth
                          size="small"
                          InputProps={{
                            startAdornment: <WebsiteIcon sx={{ color: '#94a3b8', mr: 1 }} />
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            }
                          }}
                        />
                      ) : profile.website ? (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <WebsiteIcon sx={{ color: '#94a3b8' }} />
                          <a href={profile.website} target="_blank" rel="noopener noreferrer" style={{ color: greenColor }}>
                            {profile.website}
                          </a>
                        </Stack>
                      ) : (
                        <Typography color="textSecondary" variant="body2">
                          Not provided
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </Grid>
              </Grid>

              {/* Bio */}
              <Box mt={4}>
                <Typography variant="subtitle1" fontWeight={600} mb={1.5} color="#0d5a2c">
                  About Your Business
                </Typography>
                
                {isEditing ? (
                  <TextField
                    label="Business Bio"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    multiline
                    rows={4}
                    fullWidth
                    margin="normal"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                ) : (
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {profile.bio || 'No business description provided'}
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ProviderProfile;