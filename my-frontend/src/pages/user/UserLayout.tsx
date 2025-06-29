import React, { useState, useEffect } from "react";
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
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Menu,
  MenuList,
  MenuItem as MenuItemComponent,
  Container,
  createTheme,
  ThemeProvider,
  Stack,
  DialogActions,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import PaymentIcon from "@mui/icons-material/Payment";
import RateReviewIcon from "@mui/icons-material/RateReview";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

import MyRequest from "./MyRequest";
import MyReviews from "./MyReviews";
import Profile from "./Profile";
import ProtectedRoute from "../Protectedroute";
import LocationPicker from "../../components/LocationPicker";
import BookingDialog from "../../components/BookingDialog";

// Custom theme with the specified colors
const customTheme = createTheme({
  palette: {
    primary: {
      main: '#147c3c',
      light: '#4caf50',
      dark: '#0d5d2e',
    },
    secondary: {
      main: '#f5f5f5',
      light: '#ffffff',
      dark: '#e0e0e0',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#2c3e50',
    },
    h5: {
      fontWeight: 600,
      color: '#2c3e50',
    },
    h6: {
      fontWeight: 500,
      color: '#2c3e50',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(20, 124, 60, 0.3)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #147c3c 0%, #1a8f47 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #0d5d2e 0%, #147c3c 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 0',
          '&.Mui-selected': {
            backgroundColor: 'rgba(20, 124, 60, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(20, 124, 60, 0.15)',
            },
          },
        },
      },
    },
  },
});

const categories = ["Home Services", "Personal Care", "Roadside Assistance"];

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  // Add other fields as needed
}

interface Provider {
  id: number;
  name: string;
  phone: string;
  ratings_avg_rating?: number;
  distance: number;
}

// Header Component
const Header: React.FC = () => {
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const [notificationCount] = useState(3); // Mock notification count

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: 'linear-gradient(135deg, #147c3c 0%, #1a8f47 100%)',
        boxShadow: '0 4px 20px rgba(20, 124, 60, 0.3)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            QuickAssist
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255,255,255,0.8)',
              fontWeight: 300,
            }}
          >
            Dashboard
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            color="inherit"
            onClick={handleNotificationClick}
            sx={{
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                transform: 'scale(1.05)',
              },
            }}
          >
            <Badge
              badgeContent={notificationCount}
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: '#ff4444',
                  color: 'white',
                },
              }}
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Menu
            anchorEl={notificationAnchor}
            open={Boolean(notificationAnchor)}
            onClose={handleNotificationClose}
            PaperProps={{
              sx: {
                mt: 1,
                borderRadius: 2,
                minWidth: 280,
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              },
            }}
          >
            <MenuList sx={{ p: 1 }}>
              <MenuItemComponent sx={{ borderRadius: 1, mb: 1 }}>
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    New booking request
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    2 minutes ago
                  </Typography>
                </Box>
              </MenuItemComponent>
              <MenuItemComponent sx={{ borderRadius: 1, mb: 1 }}>
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    Service completed
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    1 hour ago
                  </Typography>
                </Box>
              </MenuItemComponent>
              <MenuItemComponent sx={{ borderRadius: 1 }}>
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    Payment received
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    3 hours ago
                  </Typography>
                </Box>
              </MenuItemComponent>
            </MenuList>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

// Footer Component (integrated from the provided footer)
const Footer: React.FC = () => {
  return (
    <footer style={footerStyles.footer}>
      <div style={footerStyles.container}>
        {/* Main Footer Content */}
        <div style={footerStyles.mainContent}>
          {/* Company Info */}
          <div style={footerStyles.section}>
            <h3 style={footerStyles.sectionTitle}>QuickAssist</h3>
            <p style={footerStyles.description}>
              Your trusted platform for quick and reliable services. Connect with verified professionals in your area for all your service needs.
            </p>
            <div style={footerStyles.socialLinks}>
              <a href="#" style={footerStyles.socialLink} aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" style={footerStyles.socialLink} aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" style={footerStyles.socialLink} aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" style={footerStyles.socialLink} aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div style={footerStyles.section}>
            <h3 style={footerStyles.sectionTitle}>Quick Links</h3>
            <ul style={footerStyles.linkList}>
              <li><a href="/services" style={footerStyles.link}>Our Services</a></li>
              <li><a href="/about" style={footerStyles.link}>About</a></li>
              <li><a href="/contact" style={footerStyles.link}>Contact</a></li>
              <li><a href="/register" style={footerStyles.link}>Become Provider</a></li>
              <li><a href="/faq" style={footerStyles.link}>FAQ</a></li>
            </ul>
          </div>

          {/* Service Categories */}
          <div style={footerStyles.section}>
            <h3 style={footerStyles.sectionTitle}>Service Categories</h3>
            <ul style={footerStyles.linkList}>
              <li><a href="/categories/home" style={footerStyles.link}>Home Services</a></li>
              <li><a href="/categories/roadside" style={footerStyles.link}>Roadside Assistance</a></li>
              <li><a href="/categories/personal" style={footerStyles.link}>Personal Care</a></li>
              <li><a href="/categories/business" style={footerStyles.link}>Business Services</a></li>
              <li><a href="/categories" style={footerStyles.link}>View All</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div style={footerStyles.section}>
            <h3 style={footerStyles.sectionTitle}>Contact Us</h3>
            <div style={footerStyles.contactInfo}>
              <div style={footerStyles.contactItem}>
                <Mail size={16} style={footerStyles.contactIcon} />
                <span>info@quickassist.co.tz</span>
              </div>
              <div style={footerStyles.contactItem}>
                <Phone size={16} style={footerStyles.contactIcon} />
                <span>+255 123 456 789</span>
              </div>
              <div style={footerStyles.contactItem}>
                <MapPin size={16} style={footerStyles.contactIcon} />
                <span>Dar es Salaam, Tanzania</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={footerStyles.bottomBar}>
          <div style={footerStyles.bottomContent}>
            <p style={footerStyles.copyright}>
              &copy; {new Date().getFullYear()} QuickAssist. All rights reserved.
            </p>
            <div style={footerStyles.legalLinks}>
              <a href="/privacy" style={footerStyles.legalLink}>Privacy Policy</a>
              <a href="/terms" style={footerStyles.legalLink}>Terms of Service</a>
              <a href="/cookies" style={footerStyles.legalLink}>Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Footer styles
const footerStyles = {
  footer: {
    backgroundColor: '#1f2937',
    color: '#e5e7eb',
    marginTop: 'auto',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '40px',
    padding: '60px 0 40px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    marginBottom: '20px',
    color: '#ffffff',
  },
  description: {
    fontSize: '0.95rem',
    lineHeight: '1.6',
    marginBottom: '20px',
    color: '#d1d5db',
  },
  socialLinks: {
    display: 'flex',
    gap: '15px',
  },
  socialLink: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    backgroundColor: '#147c3c',
    color: 'white',
    borderRadius: '50%',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
  },
  linkList: {
    listStyle: 'none',
    padding: '0',
    margin: '0',
  },
  link: {
    color: '#d1d5db',
    textDecoration: 'none',
    fontSize: '0.95rem',
    lineHeight: '2',
    transition: 'color 0.3s ease',
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '0.95rem',
  },
  contactIcon: {
    color: '#147c3c',
    flexShrink: 0,
  },
  bottomBar: {
    borderTop: '1px solid #374151',
    paddingTop: '30px',
    paddingBottom: '30px',
  },
  bottomContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: '20px',
  },
  copyright: {
    margin: '0',
    fontSize: '0.9rem',
    color: '#9ca3af',
  },
  legalLinks: {
    display: 'flex',
    gap: '25px',
    flexWrap: 'wrap' as const,
  },
  legalLink: {
    color: '#9ca3af',
    textDecoration: 'none',
    fontSize: '0.9rem',
  },
};

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("services");
  const [selectedCategory, setSelectedCategory] = useState("Home Services");
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [servicesError, setServicesError] = useState("");

  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLabel, setLocationLabel] = useState<string>("Detecting location...");
  const [showMap, setShowMap] = useState(false);

  const [providers, setProviders] = useState<Provider[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [providersError, setProvidersError] = useState("");

  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  // Fetch services by category
  useEffect(() => {
    const fetchServices = async () => {
      setLoadingServices(true);
      setServicesError("");
      try {
        const response = await axios.get<{ data: Service[] } | Service[]>(
          `http://localhost:8000/api/service?category=${encodeURIComponent(selectedCategory)}`
        );
        const data = response.data;
        const fetched = Array.isArray(data) ? data : data.data;
        setServices(Array.isArray(fetched) ? fetched : []);
      } catch (err: unknown) {
        console.error("Failed to fetch services:", err);
        setServicesError("Failed to load services. Please try again.");
        setServices([]);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, [selectedCategory]);

  // Fetch providers when service and location are selected
  useEffect(() => {
    if (selectedServiceId !== null && userLocation) {
      const fetchProviders = async () => {
        setLoadingProviders(true);
        setProvidersError("");

        try {
          const response = await axios.get("http://localhost:8000/api/bookings/providers/match", {
            params: {
              service_id: selectedServiceId,
              lat: userLocation.lat,
              lng: userLocation.lng,
            },
          });

          const data = response.data as any;
          const fetchedProviders = Array.isArray(data) ? data : data.data;
          setProviders(Array.isArray(fetchedProviders) ? fetchedProviders : []);
        } catch (err) {
          console.error("Failed to fetch providers:", err);
          setProvidersError("Failed to load providers near you.");
          setProviders([]);
        } finally {
          setLoadingProviders(false);
        }
      };

      fetchProviders();
    }
  }, [selectedServiceId, userLocation]);

  // Automatically detect user location on service selection
  useEffect(() => {
    if (selectedServiceId !== null && !userLocation && !showMap) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setUserLocation({ lat, lng });
            // Reverse geocode to get simple address label (no country/region)
            try {
              const res = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
              );
              const address = (res.data as any).address;
              // Compose label without country, state, district
              let label = "";
              if (address.road) label += address.road + ", ";
              if (address.city) label += address.city + ", ";
              else if (address.town) label += address.town + ", ";
              else if (address.village) label += address.village + ", ";
              if (address.suburb) label += address.suburb;
              setLocationLabel(label.trim().replace(/,\s*$/, ""));
            } catch {
              setLocationLabel("Current location");
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            setLocationLabel("Location permission denied or unavailable.");
          }
        );
      } else {
        setLocationLabel("Geolocation not supported.");
      }
    }
  }, [selectedServiceId, userLocation, showMap]);

  const handleBookClick = (serviceId: number) => {
    setSelectedServiceId(serviceId);
    setUserLocation(null);
    setLocationLabel("Detecting location...");
    setProviders([]);
    setProvidersError("");
    setShowMap(false);
    setSelectedProvider(null);
  };

  const openBookingDialog = (provider: Provider) => {
    setSelectedProvider(provider);
    setBookingDialogOpen(true);
  };

  const handleBookingSuccess = async ({
    scheduled_time,
    notes,
    communication,
  }: {
    scheduled_time: string;
    notes: string;
    communication: string;
  }) => {
    if (!selectedProvider || !selectedServiceId || !userLocation) return;

    // Convert date if needed
    const parsedDate = new Date(scheduled_time);
    if (isNaN(parsedDate.getTime())) {
      alert("Invalid booking date/time selected.");
      return;
    }
    const isoDate = parsedDate.toISOString();
    const formattedDate = isoDate.split("T")[0]; // 'YYYY-MM-DD'

    try {
      await axios.post(
        "http://localhost:8000/api/bookings/book",
        {
          provider_id: selectedProvider.id,
          service_id: selectedServiceId,
          latitude: userLocation.lat,
          longitude: userLocation.lng,
          booking_date: formattedDate,
          address: locationLabel,
        },
      );
      alert("Booking successful!");
      setBookingDialogOpen(false);
      setSelectedProvider(null);
      setSelectedServiceId(null);
      setProviders([]);
      setUserLocation(null);
      setLocationLabel("Detecting location...");
    } catch (error: any) {
      if (error.response?.status === 422) {
        console.error("Validation failed:", error.response.data.errors);
        alert("Validation error: " + JSON.stringify(error.response.data.errors));
      } else {
        console.error("Booking failed:", error);
        alert("Booking failed. Please try again.");
      }
    }
  };

  const handleCancelBooking = () => {
    setSelectedServiceId(null);
    setProviders([]);
    setProvidersError("");
    setUserLocation(null);
    setLocationLabel("Detecting location...");
    setShowMap(false);
    setSelectedProvider(null);
  };

  // When user clicks 'Select Another Location'
  const handleSelectAnotherLocation = () => {
    setShowMap(true);
  };

  // When LocationPicker returns new location
  const onLocationSelect = async (lat: number, lng: number, address: string) => {
    setUserLocation({ lat, lng });
    setShowMap(false);
    // Use provided address or reverse geocode
    if (address) {
      setLocationLabel(address);
    } else {
      // Reverse geocode label without country, region etc.
      try {
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const addressData = (res.data as any).address;
        let label = "";
        if (addressData.road) label += addressData.road + ", ";
        if (addressData.city) label += addressData.city + ", ";
        else if (addressData.town) label += addressData.town + ", ";
        else if (addressData.village) label += addressData.village + ", ";
        if (addressData.suburb) label += addressData.suburb;
        setLocationLabel(label.trim().replace(/,\s*$/, ""));
      } catch {
        setLocationLabel("Selected location");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete axios.defaults.headers.common["Authorization"];
      navigate("/login");
    } catch {
      alert("Logout failed.");
    }
  };

  return (
    <ThemeProvider theme={customTheme}>
      <ProtectedRoute roles={["user"]}>
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: 'background.default',
        }}>
          {/* Header */}
          <Header />

          {/* Main Content */}
          <Container maxWidth="xl" sx={{ flex: 1, py: 4 }}>
            <Box sx={{ display: "flex", gap: 4, minHeight: 'calc(100vh - 200px)' }}>
              {/* Sidebar */}
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  minWidth: 280,
                  height: 'fit-content',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      fontWeight: 700,
                      width: 48,
                      height: 48,
                    }}
                  >
                    K
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Kalistine
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Premium User
                    </Typography>
                  </Box>
                </Box>

                <List sx={{ '& .MuiListItemButton-root': { mb: 1 } }}>
                  {["services", "requests", "reviews", "payments", "messages", "profile"].map((key) => (
                    <ListItemButton
                      key={key}
                      selected={activeTab === key}
                      onClick={() => {
                        setActiveTab(key);
                        setSelectedServiceId(null);
                        setProviders([]);
                        setUserLocation(null);
                        setShowMap(false);
                        setSelectedProvider(null);
                      }}
                      sx={{
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(20, 124, 60, 0.1)',
                          borderLeft: '4px solid #147c3c',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ color: activeTab === key ? 'primary.main' : 'inherit' }}>
                        {key === "services" ? <HomeIcon fontSize="small" /> :
                          key === "requests" ? <HistoryIcon fontSize="small" /> :
                            key === "reviews" ? <RateReviewIcon fontSize="small" /> :
                              key === "payments" ? <PaymentIcon fontSize="small" /> :
                                key === "messages" ? <SettingsIcon fontSize="small" /> :
                                  <PersonIcon fontSize="small" />}
                      </ListItemIcon>
                      <ListItemText
                        primary={key.charAt(0).toUpperCase() + key.slice(1)}
                        primaryTypographyProps={{
                          fontWeight: activeTab === key ? 600 : 400,
                          color: activeTab === key ? 'primary.main' : 'inherit',
                        }}
                      />
                    </ListItemButton>
                  ))}
                  <Divider sx={{ my: 2 }} />
                  <ListItemButton
                    onClick={handleLogout}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(244, 67, 54, 0.1)',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: '#f44336' }}>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Logout"
                      primaryTypographyProps={{ color: '#f44336' }}
                    />
                  </ListItemButton>
                </List>
              </Paper>

              {/* Main Content Area */}
              <Box sx={{ flex: 1 }}>
                {activeTab === "requests" ? (
                  <MyRequest />
                ) : activeTab === "reviews" ? (
                  <MyReviews />
                ) : activeTab === "profile" ? (
                  <Profile />
                ) : selectedServiceId !== null ? (
                  <Paper sx={{ p: 4, borderRadius: 3 }}>
                    {!userLocation && !showMap && (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <CircularProgress sx={{ mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                          Detecting your location...
                        </Typography>
                        <Button
                          variant="outlined"
                          onClick={handleSelectAnotherLocation}
                          sx={{ mt: 2 }}
                        >
                          Select Another Location
                        </Button>
                        <LocationPicker onLocationSelect={onLocationSelect} />
                      </Box>
                    )}

                    {userLocation && !showMap && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                          📍 Your Location: {locationLabel}
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={handleSelectAnotherLocation}
                        >
                          Change Location
                        </Button>
                      </Box>
                    )}

                    {showMap && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                          Select Location on Map
                        </Typography>
                        <LocationPicker onLocationSelect={onLocationSelect} />
                      </Box>
                    )}

                    <Box>
                      <Typography variant="h5" fontWeight={600} mb={3} sx={{ color: 'primary.main' }}>
                        🔍 Providers Near You
                      </Typography>
                      {loadingProviders ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                          <CircularProgress />
                        </Box>
                      ) : providersError ? (
                        <Typography color="error" sx={{ textAlign: 'center', py: 2 }}>
                          {providersError}
                        </Typography>
                      ) : providers.length === 0 ? (
                        <Typography sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                          No providers found near your location for this service.
                        </Typography>
                      ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          {providers.map((provider) => (
                            <Paper
                              key={provider.id}
                              sx={{
                                p: 3,
                                borderRadius: 2,
                                border: '1px solid #e0e0e0',
                                '&:hover': {
                                  borderColor: 'primary.main',
                                  transform: 'translateY(-2px)',
                                },
                                transition: 'all 0.3s ease',
                              }}
                            >
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                  <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                                    {provider.name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    ⭐ Rating: {provider.ratings_avg_rating?.toFixed(1) ?? "N/A"} |
                                    📍 Distance: {provider.distance?.toFixed(2) ?? "N/A"} km
                                  </Typography>
                                </Box>
                                <Button
                                  variant="contained"
                                  onClick={() => openBookingDialog(provider)}
                                  sx={{
                                    minWidth: 140,
                                    fontWeight: 600,
                                  }}
                                >
                                  Book Now
                                </Button>
                              </Box>
                            </Paper>
                          ))}
                        </Box>
                      )}
                    </Box>

                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                      <Button
                        variant="text"
                        onClick={handleCancelBooking}
                        sx={{ color: 'text.secondary' }}
                      >
                        ← Back to Services
                      </Button>
                    </Box>
                  </Paper>
                ) : (
                  <Paper sx={{ p: 4, borderRadius: 3 }}>
                    <Typography variant="h4" fontWeight={600} mb={3} sx={{ color: 'primary.main' }}>
                      🛠️ Browse Services
                    </Typography>

                    <Select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      sx={{
                        mb: 4,
                        minWidth: 220,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>

                    {loadingServices ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                      </Box>
                    ) : servicesError ? (
                      <Typography color="error" sx={{ textAlign: 'center', py: 2 }}>
                        {servicesError}
                      </Typography>
                    ) : services.length === 0 ? (
                      <Typography sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                        No services available in this category.
                      </Typography>
                    ) : (
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                          gap: 3,
                        }}
                      >
                        {services.map((service) => (
                          <Card
                            key={service.id}
                            sx={{
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: '0 12px 30px rgba(20, 124, 60, 0.15)',
                              },
                            }}
                          >
                            {service.image_url && (
                              <CardMedia
                                component="img"
                                height="200"
                                image={service.image_url}
                                alt={service.name}
                                sx={{ objectFit: 'cover' }}
                              />
                            )}
                            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                              <Typography
                                variant="h6"
                                fontWeight={600}
                                gutterBottom
                                sx={{ color: 'primary.main' }}
                              >
                                {service.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 2, lineHeight: 1.6 }}
                              >
                                {service.description}
                              </Typography>
                              <Typography
                                variant="h6"
                                fontWeight={700}
                                sx={{ color: 'primary.main' }}
                              >
                                ${service.price}
                              </Typography>
                            </CardContent>
                            <CardActions sx={{ p: 3, pt: 0 }}>
                              <Button
                                variant="contained"
                                fullWidth
                                onClick={() => handleBookClick(service.id)}
                                sx={{
                                  py: 1.5,
                                  fontWeight: 600,
                                  fontSize: '1rem',
                                }}
                              >
                                Book This Service
                              </Button>
                            </CardActions>
                          </Card>
                        ))}
                      </Box>
                    )}
                  </Paper>
                )}
              </Box>
            </Box>
          </Container>

          {/* Footer */}
          <Footer />

          {/* Booking Dialog */}
          {bookingDialogOpen && selectedProvider && (
            <BookingDialog
              open={bookingDialogOpen}
              onClose={() => setBookingDialogOpen(false)}
              provider={selectedProvider}
              serviceId={selectedServiceId}
              userLocation={userLocation}
              onConfirm={handleBookingSuccess}
            />
          )}
        </Box>
      </ProtectedRoute>
    </ThemeProvider>
  );
};

export default UserDashboard;

