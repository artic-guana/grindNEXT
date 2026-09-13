import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    error.userMessage =
      error.response?.data?.message ||
      error.response?.data?.detail ||
      error.message ||
      'Request failed';
    return Promise.reject(error);
  }
);

export default api;
