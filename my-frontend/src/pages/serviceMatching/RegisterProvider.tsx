// src/pages/RegisterProvider.tsx
import React, { useState } from 'react';
import './RegisterProvider.css';

const serviceOptions: Record<string, string[]> = {
  home: ['House Cleaning', 'Gardening', 'Cloth Washing', 'Carpet Washing'],
  personal: ['Hair Dressing', 'Men Salon', 'Nails Making'],
  road: ['Car Repair', 'Tyre Exchange', 'Battery Jumpstart'],
};

const RegisterProvider: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    category: '',
    service: '',
    location: '',
  });

  const [loadingLocation, setLoadingLocation] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'category' ? { service: '' } : {}),
    }));
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

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    console.log('Provider Registration:', formData);
    alert('Provider registered (demo)');
  };

  return (
    <div className="register-provider-container">
      <h2>Register as a Service Provider</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Create Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Category --</option>
          <option value="home">home</option>
          <option value="personal">personal</option>
          <option value="road">road</option>
        </select>

        {formData.category && (
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
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
            placeholder="Office/Current Location (Optional)"
            value={formData.location}
            onChange={handleChange}
          />
          <button type="button" onClick={handleGetLocation} disabled={loadingLocation}>
            {loadingLocation ? 'Getting Location...' : 'Use My Location'}
          </button>
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterProvider;
