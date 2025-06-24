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
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import PaymentIcon from "@mui/icons-material/Payment";
import RateReviewIcon from "@mui/icons-material/RateReview";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import MyRequest from "./MyRequest";
import MyReviews from "./MyReviews";
import Profile from "./Profile";
import ProtectedRoute from "../Protectedroute";
import LocationPicker from "../../components/LocationPicker";
import BookingDialog from "../../components/BookingDialog";

const categories = ["Home Services", "Personal Care", "Roadside Assistance"];

interface Provider {
  id: number;
  name: string;
  ratings_avg_rating?: number;
  distance: number;
}

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("services");
  const [selectedCategory, setSelectedCategory] = useState("Home Services");
  const [services, setServices] = useState<any[]>([]);
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
        const response = await axios.get(
          `http://localhost:8000/api/services?category_name=${encodeURIComponent(selectedCategory)}`
        );
        const data = response.data as any;
        const fetched = Array.isArray(data) ? data : data.data;
        setServices(Array.isArray(fetched) ? fetched : []);
      } catch (err: any) {
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
          const response = await axios.get("http://localhost:8000/api/providers", {
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

  // ⚠️ Convert date if needed
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
        booking_date: formattedDate, // ✅
        address: locationLabel,
      },
      {
        withCredentials: true,
      }
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
  const onLocationSelect = async (lat: number, lng: number) => {
    setUserLocation({ lat, lng });
    setShowMap(false);
    // Reverse geocode label without country, region etc.
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const address = (res.data as any).address;
      let label = "";
      if (address.road) label += address.road + ", ";
      if (address.city) label += address.city + ", ";
      else if (address.town) label += address.town + ", ";
      else if (address.village) label += address.village + ", ";
      if (address.suburb) label += address.suburb;
      setLocationLabel(label.trim().replace(/,\s*$/, ""));
    } catch {
      setLocationLabel("Selected location");
    }
  };

  return (
    <ProtectedRoute roles={["user"]}>
      <Box sx={{ display: "flex", px: 3, py: 6, gap: 4 }}>
        <Paper elevation={3} sx={{ p: 3, minWidth: 280 }}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Avatar sx={{ color: "#147c3c", fontWeight: 700 }}>U</Avatar>
            <Box>
              <Typography variant="h6">kalistine</Typography>
            </Box>
          </Box>

          <List>
            {["services", "requests", "reviews", "payments", "settings", "profile"].map((key) => (
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
              >
                <ListItemIcon>
                  {key === "services" ? (
                    <HomeIcon fontSize="small" />
                  ) : key === "requests" ? (
                    <HistoryIcon fontSize="small" />
                  ) : key === "reviews" ? (
                    <RateReviewIcon fontSize="small" />
                  ) : key === "payments" ? (
                    <PaymentIcon fontSize="small" />
                  ) : key === "settings" ? (
                    <SettingsIcon fontSize="small" />
                  ) : (
                    <PersonIcon fontSize="small" />
                  )}
                </ListItemIcon>
                <ListItemText primary={key.charAt(0).toUpperCase() + key.slice(1)} />
              </ListItemButton>
            ))}
            <Divider sx={{ my: 1 }} />
            <ListItemButton onClick={async () => {
              try {
                await axios.get("http://localhost:8000/sanctum/csrf-cookie", { withCredentials: true });
                const csrfToken = Cookies.get("XSRF-TOKEN");
                axios.defaults.headers.common["X-XSRF-TOKEN"] = csrfToken ?? "";
                await axios.post("http://localhost:8000/api/logout", {}, { withCredentials: true });
                localStorage.removeItem("role");
                navigate("/login");
              } catch (error) {
                alert("Failed to logout. Please try again.");
              }
            }}>
              <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Paper>

        <Box sx={{ flex: 1 }}>
          {activeTab === "requests" ? (
            <MyRequest />
          ) : activeTab === "reviews" ? (
            <MyReviews />
          ) : activeTab === "profile" ? (
            <Profile />
          ) : selectedServiceId !== null ? (
            <>
              {!userLocation && !showMap && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Detecting your location...
                  </Typography>
                  <Button variant="contained" onClick={handleSelectAnotherLocation}>
                    Select Another Location
                  </Button>
                  {/* Invisible LocationPicker that triggers geolocation detection */}
                  <LocationPicker onLocationSelect={onLocationSelect} autoDetect />
                </>
              )}

              {userLocation && !showMap && (
                <>
                  <Typography variant="subtitle1" gutterBottom>
                    Your Location: {locationLabel}
                  </Typography>
                  <Button variant="outlined" onClick={handleSelectAnotherLocation}>
                    Select Another Location
                  </Button>
                </>
              )}

              {showMap && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Select Location on Map
                  </Typography>
                  <LocationPicker onLocationSelect={onLocationSelect} autoDetect={false} />
                </>
              )}

              <Box mt={3}>
                <Typography variant="h5" fontWeight={600} mb={2}>
                  Providers Near You
                </Typography>
                {loadingProviders ? (
                  <CircularProgress />
                ) : providersError ? (
                  <Typography color="error">{providersError}</Typography>
                ) : providers.length === 0 ? (
                  <Typography>No providers found near your location for this service.</Typography>
                ) : (
                  <List>
                    {providers.map((provider) => (
                      <ListItemButton key={provider.id}>
                        <ListItemText
                          primary={provider.name}
                          secondary={`Rating: ${provider.ratings_avg_rating ?? "N/A"} | Distance: ${provider.distance?.toFixed(2) ?? "N/A"} km`}
                        />
                        <Button
                          variant="contained"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProvider(provider);
                            setBookingDialogOpen(true);
                          }}
                        >
                          Book this provider
                        </Button>
                      </ListItemButton>
                    ))}
                  </List>
                )}
              </Box>
              <Box mt={3}>
                <Button variant="text" onClick={handleCancelBooking}>
                  Cancel Booking
                </Button>
              </Box>
            </>
          ) : (
            <>
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
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: 3,
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
                        <Typography variant="subtitle1" sx={{ color: "#147c3c", fontWeight: 700 }}>
                          From {service.price ? `Tsh ${service.price}` : "Contact for price"}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" variant="contained" onClick={() => handleBookClick(service.id)}>
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

        <BookingDialog
          open={bookingDialogOpen}
          onClose={() => setBookingDialogOpen(false)}
          provider={selectedProvider}
          serviceId={selectedServiceId}
          userLocation={userLocation}
          onConfirm={handleBookingSuccess}
        />
      </Box>
    </ProtectedRoute>
  );
};

export default UserDashboard;
