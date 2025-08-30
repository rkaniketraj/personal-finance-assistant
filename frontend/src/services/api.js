import axios from 'axios';
import { removeToken } from '../utils/auth';

const BASE_URL = 'http://localhost:5000/api'; // Update with your backend URL

// Create axios instance
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true, // Enable sending cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// No need for auth token interceptor since cookies are handled automatically
// api.interceptors.request.use() - removed

// Handle common response errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        status: 0
      });
    }

    // Handle authentication errors
    if (error.response.status === 401) {
      removeToken(); // Clear user data
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Return error with message
    return Promise.reject({
      message: error.response.data?.message || 'Something went wrong',
      status: error.response.status,
    });
  }
);

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
};

export const transactionAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/transactions${queryString ? `?${queryString}` : ''}`);
  },
  create: (data) => api.post('/transactions', data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`),
  getAnalytics: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/transactions/analytics${queryString ? `?${queryString}` : ''}`);
  },
};

export const receiptAPI = {
  upload: (formData) => api.post('/receipts/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getAll: () => api.get('/receipts'),
  delete: (id) => api.delete(`/receipts/${id}`),
};

export default api;