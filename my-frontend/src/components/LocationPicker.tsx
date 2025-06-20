import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useState } from 'react';

import type { LatLng } from 'leaflet';

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

const LocationPicker = ({ onLocationSelect }: LocationPickerProps) => {
  const [marker, setMarker] = useState<LatLng | null>(null);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setMarker(e.latlng);
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    });
    return marker ? <Marker position={marker} /> : null;
  };

  return (
    <MapContainer center={[-6.8, 39.2]} zoom={13} style={{ height: 300 }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker />
    </MapContainer>
  );
};

export default LocationPicker;
