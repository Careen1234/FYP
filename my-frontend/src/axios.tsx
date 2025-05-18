import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api', // Laravel API endpoint
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, // needed if using cookies/auth (e.g., Sanctum)
});

export default axiosInstance;
