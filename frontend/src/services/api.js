import axios from 'axios';

// Configure axios base URL - change this to your deployed API Gateway URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://6op1kbv0p2.execute-api.us-east-1.amazonaws.com/Prod';

const api = axios.create({
  baseURL: API_BASE_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// AI Agent API
export const aiAgentAPI = {
  processRequest: (prompt) => api.post('/ai-agent', { prompt }),
};

// Customer API
export const customerAPI = {
  create: (customerData) => api.post('/customers', customerData),
  get: (id) => api.get(`/customers/${id}`),
  update: (id, updateData) => api.put(`/customers/${id}`, updateData),
};

// Restaurant API
export const restaurantAPI = {
  create: (restaurantData) => api.post('/restaurants', restaurantData),
  get: (id) => api.get(`/restaurants/${id}`),
};

// Table API
export const tableAPI = {
  create: (tableData) => api.post('/tables', tableData),
  list: (restaurantId) => api.get('/tables', { params: { restaurant_id: restaurantId } }),
};

// Reservation API
export const reservationAPI = {
  create: (reservationData) => api.post('/reservations', reservationData),
  get: (id) => api.get(`/reservations/${id}`),
  update: (id, updateData) => api.put(`/reservations/${id}`, updateData),
  cancel: (id) => api.post(`/reservations/${id}/cancel`),
  getAvailableTables: (params) => api.get('/reservations/available-tables', { params }),
  list: () => api.get('/reservations'),
};

// Special Requests API
export const requestAPI = {
  create: (requestData) => api.post('/requests', requestData),
};

export default api; 