import React, { useState, useEffect } from 'react';
import './RequestService.css';
import { getDistanceFromLatLonInKm } from '../utils/locationUtils';

const serviceOptions: Record<string, string[]> = {
  home: ['House Cleaning', 'Gardening', 'Cloth Washing', 'Carpet Washing'],
  personal: ['Hair Dressing', 'Men Salon', 'Nails Making'],
  road: ['Car Repair', 'Tyre Exchange', 'Battery Jumpstart'],
};

type Provider = {
  id: string;
  name: string;
  category: string;
  services: string[];
  location: { lat: number; lng: number };
  prices?: Record<string, number>;
};

const RequestService: React.FC = () => {
  const [formData, setFormData] = useState({
    category: '',
    service: '',
    location: '',
    datetime: '',
  });
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [matchedProviders, setMatchedProviders] = useState<(Provider & { distance: number })[]>([]);

  // Fetch providers from backend on mount or when category changes
  useEffect(() => {
    if (!formData.category) return;

    setLoadingProviders(true);
    fetch(`/api/providers?category=${formData.category}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch providers');
        return res.json();
      })
      .then((data: Provider[]) => {
        setProviders(data);
        setLoadingProviders(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingProviders(false);
        alert('Failed to load providers from server');
      });
  }, [formData.category]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'category' ? { service: '' } : {}),
    }));
    setMatchedProviders([]);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          location: `${latitude}, ${longitude}`,
        }));
        setUserLocation({ lat: latitude, lng: longitude });
        setLoadingLocation(false);
      },
      error => {
        alert('Unable to retrieve location. Please allow location access.');
        console.error(error);
        setLoadingLocation(false);
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let lat = 0, lng = 0;

    if (formData.location) {
      const [latStr, lngStr] = formData.location.split(',').map(s => s.trim());
      lat = parseFloat(latStr);
      lng = parseFloat(lngStr);
    }

    const location = userLocation || (lat && lng ? { lat, lng } : null);

    if (!location) {
      alert('Location not available.');
      return;
    }

    const filteredProviders = providers
      .filter(
        p => p.services.includes(formData.service)
      )
      .map(p => {
        const distance = getDistanceFromLatLonInKm(
          location.lat,
          location.lng,
          p.location.lat,
          p.location.lng
        );
        return { ...p, distance };
      })
      .sort((a, b) => a.distance - b.distance);

    setMatchedProviders(filteredProviders);

    if (filteredProviders.length === 0) {
      alert('No providers available for this service near you.');
    }
  };

  return (
    <div className="request-service-container">
      <h2>Request a Service</h2>
      <form onSubmit={handleSubmit} className="request-form">
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Category --</option>
          <option value="home">Home Services</option>
          <option value="personal">Personal Care</option>
          <option value="road">Roadside Assistance</option>
        </select>

        {formData.category && (
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
            disabled={loadingProviders}
          >
            <option value="">-- Select Service --</option>
            {serviceOptions[formData.category].map(service => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        )}

        <div className="location-input-group">
          <input
            type="text"
            name="location"
            placeholder="Your Current Location (lat, lng)"
            value={formData.location}
            onChange={handleChange}
            required
          />
          <button type="button" onClick={handleGetLocation} disabled={loadingLocation}>
            {loadingLocation ? 'Getting...' : 'Use My Location'}
          </button>
        </div>

        <input
          type="datetime-local"
          name="datetime"
          value={formData.datetime}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loadingProviders}>
          {loadingProviders ? 'Loading Providers...' : 'Request Service'}
        </button>
      </form>

      {matchedProviders.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Available Providers:</h3>
          <ul>
            {matchedProviders.map((provider, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>
                <strong>{provider.name}</strong> <br />
                Service: {formData.service} <br />
                Distance: {provider.distance.toFixed(2)} km <br />
                Price: ${provider.prices?.[formData.service] ?? 'Not set'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RequestService;
