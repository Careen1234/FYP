import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api', 
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, 
});

import Cookies from "js-cookie";

const csrfToken = Cookies.get("XSRF-TOKEN"); // this reads the token from cookies

axiosInstance.defaults.headers.common["X-XSRF-TOKEN"] = csrfToken!;


export default axiosInstance;
