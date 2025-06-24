import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Paper,
} from '@mui/material';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationPicker = ({ setLat, setLng, lat, lng }: any) => {
  useMapEvents({
    click(e) {
      setLat(e.latlng.lat);
      setLng(e.latlng.lng);
    },
  });

  return lat && lng ? <Marker position={[lat, lng]} /> : null;
};

const ProviderProfile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  // ✅ Fetch profile
  useEffect(() => {
    interface ProviderProfileResponse {
      provider: {
        name?: string;
        phone?: string;
        location?: string;
        latitude?: number;
        longitude?: number;
      };
    }

    axios
      .get<ProviderProfileResponse>('http://localhost:8000/api/provider/profile', { withCredentials: true })
      .then((res) => {
        const provider = res.data.provider;
        setName(provider.name || '');
        setPhone(provider.phone || '');
        setLocation(provider.location || '');
        setLat(provider.latitude ?? null);
        setLng(provider.longitude ?? null);
      })
      .catch((err) => console.error('Failed to fetch profile', err))
      .then(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await axios.put(
        'http://localhost:8000/api/provider/profile',
        {
          name,
          phone,
          location,
          latitude: lat,
          longitude: lng,
        },
        { withCredentials: true }
      );
      alert('Profile updated!');
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" mb={2}>Provider Profile</Typography>

      <TextField
        fullWidth
        label="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Street / Area"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Typography variant="subtitle1" mb={1}>
        Tap on map to select your exact location:
      </Typography>
      <Box sx={{ height: 300, mb: 2, borderRadius: 1, overflow: 'hidden' }}>
        <MapContainer
          center={[lat ?? -6.8, lng ?? 39.2]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationPicker setLat={setLat} setLng={setLng} lat={lat} lng={lng} />
        </MapContainer>
      </Box>

      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={saving}
        sx={{ backgroundColor: '#147c3c' }}
      >
        {saving ? 'Saving...' : 'Save Profile'}
      </Button>
    </Paper>
  );
};

export default ProviderProfile;
