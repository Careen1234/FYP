
import React, { useState } from 'react';
import axios from 'axios';

const PaymentForm = () => {
  const [form, setForm] = useState({
    accountNumber: '',
    amount: '',
    provider: 'Tigo',
  });
  const [status, setStatus] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Processing...');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8000/api/clickpesa', form);
      setStatus(`Payment initiated: ${JSON.stringify(response.data)}`);
    } catch (error: any) {
      setStatus('Error: ' + (error.response?.data?.message || 'Something went wrong'));
    }
  };

  return (
    <div>
      <h2>AzamPay Payment</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="accountNumber"
          placeholder="Phone Number"
          required
          value={form.accountNumber}
          onChange={handleChange}
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          required
          value={form.amount}
          onChange={handleChange}
        />
        <select name="provider" value={form.provider} onChange={handleChange}>
          <option value="Tigo">Tigo</option>
          <option value="Airtel">Airtel</option>
          <option value="Vodacom">Vodacom</option>
          <option value="HaloPesa">HaloPesa</option>
          <option value="Mpesa">Mpesa</option>
        </select>
        <button type="submit">Pay Now</button>
      </form>
      <p>{status}</p>
    </div>
  );
};

export default PaymentForm;
