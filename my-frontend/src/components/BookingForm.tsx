import React, { useState } from 'react';
import './BookingForm.css';

interface BookingFormProps {
  serviceTitle: string;
  onClose: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ serviceTitle, onClose }) => {
  const [formData, setFormData] = useState({
    district: '',
    street: '',
    taskSize: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Booking submitted:', { serviceTitle, ...formData });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="booking-form-overlay">
      <div className="booking-form-container">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Book {serviceTitle} Service</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Task Location</h3>
            <div className="form-group">
              <label htmlFor="district">District:</label>
              <input
                type="text"
                id="district"
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
                placeholder="Enter your district"
              />
            </div>
            <div className="form-group">
              <label htmlFor="street">Street Address:</label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                required
                placeholder="Enter your street address"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Task Size</h3>
            <div className="form-group">
              <label htmlFor="taskSize">Estimated Duration:</label>
              <select
                id="taskSize"
                name="taskSize"
                value={formData.taskSize}
                onChange={handleChange}
                required
              >
                <option value="">Select task size</option>
                <option value="large">Large (7-10 hours)</option>
                <option value="medium">Medium (3-6 hours)</option>
                <option value="small">Small (1-2 hours)</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <h3>Task Description</h3>
            <div className="form-group">
              <label htmlFor="description">Please describe your task:</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Provide details about the service you need"
                rows={4}
              />
            </div>
          </div>

          <button type="submit" className="submit-btn">Submit Booking</button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm; 