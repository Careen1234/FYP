import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://http://127.0.0.1:8000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});
export const fetchUsers = () => apiClient.get('/users');
export const fetchUserDetails = (id: number) => apiClient.get(`/users/${id}`);
export const addUser = (user: any) => apiClient.post('/users', user);
export const updateUser = (id: number, user: any) => apiClient.put(`/users/${id}`, user);
export const deleteUser = (id: number) => apiClient.delete(`/users/${id}`);
export const blockUser = (id: number) => apiClient.post(`/users/${id}/block`);