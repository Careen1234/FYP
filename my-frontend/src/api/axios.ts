import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // your Laravel API base URL
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default API;
