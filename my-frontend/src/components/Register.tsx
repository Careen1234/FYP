import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Alert,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  InputAdornment,
  Link,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Collapse,
  IconButton
} from "@mui/material";
import axios from "axios";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from "@mui/icons-material";

const roles = [
  { value: "user", label: "User" },
  { value: "provider", label: "Service Provider" },
];

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user",
    password: "",
    password_confirmation: "",
    service: "",
    location: "",
    latitude: "",
    longitude: "",
  });

  const [services, setServices] = useState<{ id: number; name: string }[]>([]);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [providerSectionOpen, setProviderSectionOpen] = useState(false);

  // Load services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/service/register");
        const data = res.data as { services?: { id: number; name: string }[] };
        setServices(data.services || []);
      } catch (err) {
        console.error("Failed to load services", err);
      }
    };
    fetchServices();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === "role" && value !== "provider") {
        return { ...prev, role: value, service: "", location: "", latitude: "", longitude: "" };
      }
      return { ...prev, [name]: value };
    });

    if (name === "location" && formData.role === "provider") {
      fetchLocationSuggestions(value);
    }
  };

  const fetchLocationSuggestions = async (query: string) => {
    if (!query || query.length < 3) {
      setLocationSuggestions([]);
      return;
    }

    setLocationLoading(true);
    try {
      const res = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: query,
          format: "json",
          addressdetails: 1,
          limit: 5,
          bounded: 1,
          viewbox: "39.0,-6.5,39.5,-7.2",
        },
      });
      setLocationSuggestions(res.data as any[]);
    } catch (error) {
      console.error("Failed to fetch location suggestions", error);
      setLocationSuggestions([]);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleLocationSelect = (place: any) => {
    setFormData((prev) => ({
      ...prev,
      location: place.display_name,
      latitude: place.lat,
      longitude: place.lon,
    }));
    setLocationSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess("");

    try {
      await axios.get("http://localhost:8000/sanctum/csrf-cookie", { withCredentials: true });

      const payload = { ...formData };
      if (payload.role !== "provider") {
        delete payload.service;
        delete payload.location;
        delete payload.latitude;
        delete payload.longitude;
      }

      await axios.post("http://localhost:8000/api/register", payload, {
        withCredentials: true,
      });

      setSuccess("Registration successful!.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "user",
        password: "",
        password_confirmation: "",
        service: "",
        location: "",
        latitude: "",
        longitude: "",
      });
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: "Registration failed. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0fdf4 0%, #e2f0eb 100%)",
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 700,
          width: "100%",
          p: 4,
          borderRadius: 3,
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
          border: "1px solid rgba(20, 124, 60, 0.1)",
          background: "white",
        }}
      >
        <Box textAlign="center" mb={4}>
          <Box
            sx={{
              bgcolor: "rgba(20, 124, 60, 0.1)",
              width: 80,
              height: 80,
              borderRadius: "50%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <PersonIcon sx={{ color: "#147c3c", fontSize: 40 }} />
          </Box>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ color: "#0d5a2c", mb: 1 }}
          >
            Create Your Account
          </Typography>
          <Typography variant="body1" sx={{ color: "#64748b", maxWidth: 500, mx: "auto" }}>
            Join our community to access exclusive services and features
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          <Step>
            <StepLabel>Account Details</StepLabel>
          </Step>
          <Step>
            <StepLabel>Password</StepLabel>
          </Step>
          <Step>
            <StepLabel>Complete</StepLabel>
          </Step>
        </Stepper>

        <Box component="form" onSubmit={handleSubmit}>
          {errors.general && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
                border: "1px solid #ffebee",
              }}
            >
              {errors.general}
            </Alert>
          )}

          {success && (
            <Alert
              severity="success"
              sx={{
                mb: 3,
                borderRadius: 2,
                border: "1px solid #e8f5e9",
              }}
            >
              {success}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: "#0d5a2c", mb: 1, display: "flex", alignItems: "center" }}>
                <PersonIcon sx={{ mr: 1, color: "#147c3c" }} />
                Basic Information
              </Typography>
              <Paper sx={{ p: 2, borderRadius: 2, border: "1px solid #e2e8f0" }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      margin="normal"
                      required
                      error={Boolean(errors.name)}
                      helperText={errors.name?.[0]}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ color: "#94a3b8" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          "& fieldset": {
                            borderColor: "#e2e8f0",
                          },
                          "&:hover fieldset": {
                            borderColor: "#cbd5e1",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#147c3c",
                            borderWidth: 1,
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      margin="normal"
                      required
                      error={Boolean(errors.email)}
                      helperText={errors.email?.[0]}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: "#94a3b8" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          "& fieldset": {
                            borderColor: "#e2e8f0",
                          },
                          "&:hover fieldset": {
                            borderColor: "#cbd5e1",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#147c3c",
                            borderWidth: 1,
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      margin="normal"
                      required
                      error={Boolean(errors.phone)}
                      helperText={errors.phone?.[0]}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon sx={{ color: "#94a3b8" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          "& fieldset": {
                            borderColor: "#e2e8f0",
                          },
                          "&:hover fieldset": {
                            borderColor: "#cbd5e1",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#147c3c",
                            borderWidth: 1,
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      label="Account Type"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      margin="normal"
                      required
                      error={Boolean(errors.role)}
                      helperText={errors.role?.[0]}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          "& fieldset": {
                            borderColor: "#e2e8f0",
                          },
                          "&:hover fieldset": {
                            borderColor: "#cbd5e1",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#147c3c",
                            borderWidth: 1,
                          },
                        },
                      }}
                    >
                      {roles.map((role) => (
                        <MenuItem key={role.value} value={role.value}>
                          {role.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Provider Information - Collapsible */}
            {formData.role === "provider" && (
              <Grid item xs={12}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    cursor: 'pointer',
                    p: 1,
                    borderRadius: 1,
                    bgcolor: 'rgba(20, 124, 60, 0.05)',
                    border: '1px solid rgba(20, 124, 60, 0.1)'
                  }}
                  onClick={() => setProviderSectionOpen(!providerSectionOpen)}
                >
                  <Typography variant="h6" sx={{ color: "#0d5a2c", display: "flex", alignItems: "center" }}>
                    <BusinessIcon sx={{ mr: 1, color: "#147c3c" }} />
                    Service Provider Details
                  </Typography>
                  <IconButton>
                    {providerSectionOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Box>
                
                <Collapse in={providerSectionOpen}>
                  <Paper sx={{ p: 2, borderRadius: 2, border: "1px solid #e2e8f0", mt: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          select
                          fullWidth
                          label="Service Provided"
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          margin="normal"
                          required
                          error={Boolean(errors.service)}
                          helperText={errors.service?.[0]}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <BusinessIcon sx={{ color: "#94a3b8" }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              "& fieldset": {
                                borderColor: "#e2e8f0",
                              },
                              "&:hover fieldset": {
                                borderColor: "#cbd5e1",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#147c3c",
                                borderWidth: 1,
                              },
                            },
                          }}
                        >
                          {services.map((s) => (
                            <MenuItem key={s.id} value={String(s.id)}>
                              {s.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Business Location"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          margin="normal"
                          required
                          error={Boolean(errors.location)}
                          helperText={errors.location?.[0] || "e.g., Mwenge, Kariakoo"}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LocationIcon sx={{ color: "#94a3b8" }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              "& fieldset": {
                                borderColor: "#e2e8f0",
                              },
                              "&:hover fieldset": {
                                borderColor: "#cbd5e1",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#147c3c",
                                borderWidth: 1,
                              },
                            },
                          }}
                        />

                        {locationLoading && (
                          <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <CircularProgress size={20} sx={{ my: 1 }} />
                          </Box>
                        )}
                        {locationSuggestions.length > 0 && (
                          <Paper
                            elevation={0}
                            sx={{
                              mt: 1,
                              maxHeight: 200,
                              overflow: "auto",
                              borderRadius: 2,
                              border: "1px solid #e2e8f0",
                            }}
                          >
                            <List dense>
                              {locationSuggestions.map((place, index) => (
                                <ListItemButton
                                  key={index}
                                  onClick={() => handleLocationSelect(place)}
                                  sx={{
                                    "&:hover": {
                                      backgroundColor: "rgba(20, 124, 60, 0.05)",
                                    },
                                  }}
                                >
                                  <ListItemText
                                    primary={place.display_name}
                                    primaryTypographyProps={{ fontSize: "0.875rem" }}
                                  />
                                </ListItemButton>
                              ))}
                            </List>
                          </Paper>
                        )}
                      </Grid>
                    </Grid>
                  </Paper>
                </Collapse>
              </Grid>
            )}

            {/* Password Section */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: "#0d5a2c", mb: 1, display: "flex", alignItems: "center" }}>
                <LockIcon sx={{ mr: 1, color: "#147c3c" }} />
                Security
              </Typography>
              <Paper sx={{ p: 2, borderRadius: 2, border: "1px solid #e2e8f0" }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      margin="normal"
                      required
                      error={Boolean(errors.password)}
                      helperText={errors.password?.[0] || "At least 8 characters"}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: "#94a3b8" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          "& fieldset": {
                            borderColor: "#e2e8f0",
                          },
                          "&:hover fieldset": {
                            borderColor: "#cbd5e1",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#147c3c",
                            borderWidth: 1,
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      name="password_confirmation"
                      type="password"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      margin="normal"
                      required
                      error={Boolean(errors.password_confirmation)}
                      helperText={errors.password_confirmation?.[0]}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: "#94a3b8" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          "& fieldset": {
                            borderColor: "#e2e8f0",
                          },
                          "&:hover fieldset": {
                            borderColor: "#cbd5e1",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#147c3c",
                            borderWidth: 1,
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              bgcolor: "#147c3c",
              py: 1.5,
              mt: 3,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1.1rem",
              fontWeight: 600,
              boxShadow: "0 4px 6px rgba(20, 124, 60, 0.2)",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "#0d5a2c",
                boxShadow: "0 6px 10px rgba(20, 124, 60, 0.3)",
                transform: "translateY(-2px)",
              },
              "&.Mui-disabled": {
                bgcolor: "#e2e8f0",
                color: "#94a3b8",
                boxShadow: "none",
              },
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Create Account"}
          </Button>

          <Box mt={3} textAlign="center">
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Already have an account?{" "}
              <Link
                href="/login"
                underline="hover"
                sx={{
                  color: "#147c3c",
                  fontWeight: 600,
                  "&:hover": {
                    color: "#0d5a2c",
                  },
                }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}