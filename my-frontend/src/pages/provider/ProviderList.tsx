import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Provider = {
  id: number;
  name: string;
  average_rating?: number;
  // Add other fields as needed
};

interface ProviderListProps {
  serviceId: number;
  userLat: number;
  userLng: number;
}

function ProviderList({ serviceId, userLat, userLng }: ProviderListProps) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!serviceId || !userLat || !userLng) return;

    setLoading(true);
    setError(null);

    axios.get('/api/providers', {
      params: { service_id: serviceId, user_lat: userLat, user_lng: userLng }
    })
    .then(response => {
      setProviders(response.data as Provider[]);
      setLoading(false);
    })
    .catch(err => {
      setError('Failed to load providers.');
      setLoading(false);
    });
  }, [serviceId, userLat, userLng]);

  if (loading) return <p>Loading providers...</p>;
  if (error) return <p>{error}</p>;
  if (!providers.length) return <p>No providers found.</p>;

  return (
    <div>
      <h3>Available Providers</h3>
      <ul>
        {providers.map(provider => (
          <li key={provider.id}>
            <strong>{provider.name}</strong> <br />
            Rating: {provider.average_rating ? provider.average_rating.toFixed(1) : 'No ratings'} <br />
            Distance: {/* optional: calculate & display distance if you want */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProviderList;
