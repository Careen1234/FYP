import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const BookingManager: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialProviderId = queryParams.get("providerId");
  const initialServiceId = queryParams.get("serviceId");

  const [providerId, setProviderId] = useState<number | null>(initialProviderId ? parseInt(initialProviderId) : null);
  const [serviceId, setServiceId] = useState<number | null>(initialServiceId ? parseInt(initialServiceId) : null);

  const [scheduledTime, setScheduledTime] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');

  const handleBooking = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/bookings', {
        provider_id: providerId,
        service_id: serviceId,
        scheduled_time: scheduledTime,
        address,
        notes,
      });

      setMessage("Booking successful!");
    } catch (error) {
      console.error("Booking failed:", error);
      setMessage("Booking failed.");
    }
  };

  return (
    <div>
      <h2>Book Provider</h2>
      {message && <p>{message}</p>}
      <form onSubmit={(e) => { e.preventDefault(); handleBooking(); }}>
        <p><strong>Provider ID:</strong> {providerId}</p>
        <p><strong>Service ID:</strong> {serviceId}</p>

        <label>
          Address:
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
        </label>

        <label>
          Notes:
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>

        <label>
          Scheduled Time:
          <input type="datetime-local" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} required />
        </label>

        <button type="submit">Book Now</button>
      </form>
    </div>
  );
};

export default BookingManager;
