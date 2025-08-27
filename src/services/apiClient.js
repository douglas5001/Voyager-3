import axios from 'axios';
import { initLoading, finalizarLoading } from './loadingBus';

export const apiBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({ baseURL: apiBaseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  initLoading();
  return config;
});

api.interceptors.response.use(
  (res) => {
    finalizarLoading();
    return res;
  },
  (err) => {
    finalizarLoading();
    const status = err?.response?.status;
    if (status === 401) {
      localStorage.removeItem('access_token');
      window.location.assign('/login');
    }
    return Promise.reject(err);
  }
);

export default api;
