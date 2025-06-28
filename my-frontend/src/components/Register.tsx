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
} from "@mui/material";
import axios from "axios";

const roles = [
  { value: "user", label: "User" },
  { value: "provider", label: "Provider" },
];

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user",
    password: "",
    password_confirmation: "",
    service: "", // for provider
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
          viewbox: "39.0,-6.5,39.5,-7.2", // Dar es Salaam region
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
      maxWidth={420}
      mx="auto"
      mt={5}
      p={3}
      boxShadow={3}
      borderRadius={2}
      component="form"
      onSubmit={handleSubmit}
    >
      <Typography variant="h5" mb={2} align="center">
        Register
      </Typography>

      {errors.general && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.general}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        margin="normal"
        required
        error={Boolean(errors.name)}
        helperText={errors.name?.[0]}
      />

      <TextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        margin="normal"
        required
        error={Boolean(errors.email)}
        helperText={errors.email?.[0]}
      />

      <TextField
        fullWidth
        label="Phone"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        margin="normal"
        required
        error={Boolean(errors.phone)}
        helperText={errors.phone?.[0]}
      />

      <TextField
        select
        fullWidth
        label="Role"
        name="role"
        value={formData.role}
        onChange={handleChange}
        margin="normal"
        required
        error={Boolean(errors.role)}
        helperText={errors.role?.[0]}
      >
        {roles.map((role) => (
          <MenuItem key={role.value} value={role.value}>
            {role.label}
          </MenuItem>
        ))}
      </TextField>

      {/* Show Service + Location for providers */}
      {formData.role === "provider" && (
        <>
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
          >
            {services.map((s) => (
              <MenuItem key={s.id} value={String(s.id)}>
                {s.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Your Location "
            name="location"
            value={formData.location}
            onChange={handleChange}
            margin="normal"
            required
            error={Boolean(errors.location)}
            helperText={errors.location?.[0] || " (e.g., Mwenge, Kariakoo)"}
          />

          {locationLoading && <CircularProgress size={20} sx={{ my: 1 }} />}
          {locationSuggestions.length > 0 && (
            <Paper elevation={3} sx={{ mt: 1, maxHeight: 200, overflow: "auto" }}>
              <List dense>
                {locationSuggestions.map((place, index) => (
                  <ListItemButton key={index} onClick={() => handleLocationSelect(place)}>
                    <ListItemText primary={place.display_name} />
                  </ListItemButton>
                ))}
              </List>
            </Paper>
          )}
        </>
      )}

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
        helperText={errors.password?.[0]}
      />

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
      />

      <Button
        type="submit"
        variant="contained"
        color="success"
        fullWidth
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : "Register"}
      </Button>
    </Box>
  );
}
