// Environment configuration
const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  API_BASE_URL_WITHOUT_API: import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000',
};

export default config;
