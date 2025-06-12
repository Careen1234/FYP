import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  TextField,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  MenuItem,
  Select,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  CircularProgress
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import PaymentIcon from '@mui/icons-material/Payment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RateReviewIcon from '@mui/icons-material/RateReview';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';

const categories = ['Home Services', 'Personal Care', 'Roadside Assistance'];

interface Provider {
  id: number;
  name: string;
  ratings_avg_rating?: number;
  distance: number;
}

const UserDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [selectedCategory, setSelectedCategory] = useState('Home Services');
  const [services, setServices] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [servicesError, setServicesError] = useState('');

  // For provider listing on booking
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [providersError, setProvidersError] = useState('');

  // Fetch services when category changes
  useEffect(() => {
    const fetchServices = async () => {
      setLoadingServices(true);
      setServicesError('');
      try {
        const response = await axios.get(
          `http://localhost:8000/api/services?category_name=${encodeURIComponent(selectedCategory)}`
        );
        const data = response.data as any;
        const fetched = Array.isArray(data) ? data : data.data;
        if (Array.isArray(fetched)) {
          setServices(fetched);
        } else {
          throw new Error('Invalid data format from server.');
        }
      } catch (err: any) {
        console.error('Failed to fetch services:', err);
        setServicesError('Failed to load services. Please try again.');
        setServices([]);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, [selectedCategory]);

  // Get user location on mount (or when booking starts)
  useEffect(() => {
    if (selectedServiceId !== null && !userLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (err) => {
            console.error('Geolocation error:', err);
            setProvidersError('Could not get your location. Please enable location services.');
          }
        );
      } else {
        setProvidersError('Geolocation is not supported by your browser.');
      }
    }
  }, [selectedServiceId, userLocation]);

  // Fetch providers when selectedServiceId and userLocation are set
  useEffect(() => {
    if (selectedServiceId !== null && userLocation) {
      const fetchProviders = async () => {
        setLoadingProviders(true);
        setProvidersError('');
        try {
          const response = await axios.get('http://localhost:8000/api/providers', {
            params: {
              service_id: selectedServiceId,
              lat: userLocation.lat,
              lng: userLocation.lng
            }
          });
          const data = response.data as any;
          const fetchedProviders = Array.isArray(data) ? data : data.data;
          if (Array.isArray(fetchedProviders)) {
            setProviders(fetchedProviders);
          } else {
            throw new Error('Invalid providers data format from server.');
          }
        } catch (err) {
          console.error('Failed to fetch providers:', err);
          setProvidersError('Failed to load providers near you.');
          setProviders([]);
        } finally {
          setLoadingProviders(false);
        }
      };
      fetchProviders();
    }
  }, [selectedServiceId, userLocation]);

  // When user clicks "Book" on service card → show providers
  const handleBookClick = (serviceId: number) => {
    setSelectedServiceId(serviceId);
    setProviders([]);
    setProvidersError('');
    // userLocation is fetched automatically by useEffect
  };

  // When user selects provider to book with
  const handleBookProvider = async (providerId: number) => {
    if (!selectedServiceId) return;

    try {
      await axios.post(
        'http://localhost:8000/api/bookings/providers/match',
        {
          service_id: selectedServiceId,
          provider_id: providerId,
          latitude: userLocation?.lat,
            longitude: userLocation?.lng,
          scheduled_time: new Date().toISOString(),
          address: 'Sample Address', // You can extend this with actual user input
          notes: 'Booking from dashboard'
        },
        { withCredentials: true }
      );
      alert('Booking successful!');
      // Reset booking state after successful booking
      setSelectedServiceId(null);
      setProviders([]);
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again.');
    }
  };

  // When user cancels provider selection (to go back to service list)
  const handleCancelBooking = () => {
    setSelectedServiceId(null);
    setProviders([]);
    setProvidersError('');
  };

  return (
    <Box sx={{ display: 'flex', px: 3, py: 6, gap: 4 }}>
      {/* Sidebar */}
      <Paper elevation={3} sx={{ p: 3, minWidth: 280 }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Avatar sx={{ color: '#147c3c', fontWeight: 700 }}>U</Avatar>
          <Box>
            <Typography variant="h6">User</Typography>
            <Typography variant="body2" color="text.success"></Typography>
          </Box>
        </Box>

        <List>
          {[
            { key: 'services', label: 'Browse Services', icon: <HomeIcon fontSize="small" /> },
            { key: 'requests', label: 'My Requests', icon: <HistoryIcon fontSize="small" /> },
            { key: 'reviews', label: 'My Reviews', icon: <RateReviewIcon fontSize="small" /> },
            { key: 'payments', label: 'Payment History', icon: <PaymentIcon fontSize="small" /> },
            { key: 'wishlist', label: 'Wishlist', icon: <FavoriteIcon fontSize="small" /> },
            { key: 'settings', label: 'Settings', icon: <SettingsIcon fontSize="small" /> },
            { key: 'profile', label: 'Profile Overview', icon: <PersonIcon fontSize="small" /> }
          ].map((item) => (
            <ListItemButton
              key={item.key}
              selected={activeTab === item.key}
              onClick={() => {
                setActiveTab(item.key);
                setSelectedServiceId(null); // reset booking flow on tab change
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}

          <Divider sx={{ my: 1 }} />

          <ListItemButton onClick={() => console.log('logout')}>
            <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Paper>

      {/* Main Content */}
      <Box sx={{ flex: 1 }}>
        {/* If booking flow active (selectedServiceId != null), show providers */}
        {selectedServiceId !== null ? (
          <>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5" fontWeight={600}>
                Select Provider for Service
              </Typography>
              <Button variant="text" onClick={handleCancelBooking}>
                Cancel
              </Button>
            </Box>

            {loadingProviders ? (
              <CircularProgress />
            ) : providersError ? (
              <Typography color="error">{providersError}</Typography>
            ) : providers.length === 0 ? (
              <Typography>No providers found near your location for this service.</Typography>
            ) : (
             <List>
  {providers.map((provider) => (
    <ListItemButton
      key={provider.id}
      onClick={() => handleBookProvider(provider.id)}
    >
      <ListItemText
        primary={provider.name}
        secondary={`Rating: ${provider.ratings_avg_rating ?? 'N/A'} | Distance: ${provider.distance?.toFixed(2) ?? 'N/A'} km`}
      />
      <Button variant="contained" size="small" onClick={() => handleBookProvider(provider.id)}>
        Book this provider
      </Button>
    </ListItemButton>
  ))}
</List>

            )}
          </>
        ) : (
          <>
            {/* Show services browsing when not booking */}
            <Typography variant="h4" fontWeight={600} mb={2}>
              Browse Services
            </Typography>

            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              sx={{ mb: 3, minWidth: 220 }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>

            {loadingServices ? (
              <CircularProgress />
            ) : servicesError ? (
              <Typography color="error">{servicesError}</Typography>
            ) : services.length === 0 ? (
              <Typography>No services available in this category.</Typography>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 3
                }}
              >
                {services.map((service) => (
                  <Card key={service.id}>
                    {service.image_url && (
                      <CardMedia
                        component="img"
                        height="140"
                        image={service.image_url}
                        alt={service.name}
                      />
                    )}
                    <CardContent>
                      <Typography variant="h6">{service.name}</Typography>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        {service.description}
                      </Typography>
                      <Typography variant="subtitle1" color="147c13c" fontWeight={700}>
                        From {service.price ? `Tsh ${service.price}` : 'Contact for price'}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleBookClick(service.id)}
                      >
                        Book
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default UserDashboard;
