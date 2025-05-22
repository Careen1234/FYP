import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://http://127.0.0.1:8000/api', // change to your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchProviders = () => apiClient.get('/providers');
export const fetchProviderDetails = (id: number) => apiClient.get(`/providers/${id}`);
export const addProvider = (provider: any) => apiClient.post('/providers', provider);
export const updateProvider = (id: number, provider: any) => apiClient.put(`/providers/${id}`, provider);
export const deleteProvider = (id: number) => apiClient.delete(`/providers/${id}`);
export const approveProvider = (id: number) => apiClient.post(`/providers/${id}/approve`);
export const blockProvider = (id: number) => apiClient.post(`/providers/${id}/block`);
