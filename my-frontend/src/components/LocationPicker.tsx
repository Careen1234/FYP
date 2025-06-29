import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Stack,
} from "@mui/material";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Props {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
}

const LocationPicker: React.FC<Props> = ({ onLocationSelect }) => {
  const [location, setLocation] = useState<L.LatLng | null>(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const extractCleanAddress = (displayName: string): string => {
    const parts = displayName.split(",").map((p) => p.trim());
    return parts.slice(0, parts.length - 3).join(", ");
  };

  useEffect(() => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = L.latLng(pos.coords.latitude, pos.coords.longitude);
        setLocation(coords);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.lat}&lon=${coords.lng}`
          );

          const data = await res.json();
          const clean = extractCleanAddress(data.display_name);
          setAddress(clean);
          onLocationSelect(coords.lat, coords.lng, clean);
        } catch (err) {
          console.error("Reverse geocoding failed:", err);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        setLoading(false);
      }
    );
  }, []);

  const LocationMarker = () => {
    useMapEvents({
      click: async (e) => {
        setLocation(e.latlng);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${e.latlng.lat}&lon=${e.latlng.lng}`
          );
          const data = await res.json();
          const clean = extractCleanAddress(data.display_name);
          setAddress(clean);
          onLocationSelect(e.latlng.lat, e.latlng.lng, clean);
        } catch (err) {
          console.error("Reverse geocoding failed:", err);
        }
      },
    });
    return location ? <Marker position={location} /> : null;
  };

  return (
    <Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <Box>
          <Typography variant="subtitle1" fontWeight={600} mb={1}>
            Selected Location:
          </Typography>
          <Typography variant="body1" gutterBottom color="text.secondary">
            {address || "No address selected"}
          </Typography>

          <Stack direction="row" spacing={2} mt={2}>
            <Button
              variant="contained"
              onClick={() => setShowMap(!showMap)}
              color="primary"
            >
              {showMap ? "Hide Map" : "Select Another Location"}
            </Button>
          </Stack>

          {showMap && (
            <Box
              mt={3}
              sx={{
                width: "100%",
                maxWidth: 600,
                height: 400,
                borderRadius: 2,
                overflow: "hidden",
                mx: "auto",
              }}
            >
              <MapContainer
                center={location || [-6.8, 39.2]}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <LocationMarker />
              </MapContainer>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default LocationPicker;
