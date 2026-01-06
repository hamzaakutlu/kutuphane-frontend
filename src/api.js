import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3004', // Senin yerel backend portun
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Admin sayfalarında kullanılacak yardımcı fonksiyonlar
export const getAllUsers = () => api.get('/auth/users');
export const deleteUser = (id) => api.delete(`/auth/users/${id}`);

export default api;