import axios from 'axios';
import { useAuthStore } from '@/features/auth/authStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * @typedef {Object} ApiError
 * @property {string} message
 * @property {number} status
 * @property {Record<string, string[]>} [fieldErrors]
 * @property {*} [raw]
 */

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    if (status === 401) {
      const requestUrl = error.config?.url || '';
      const isAuthMe = requestUrl.includes('/api/auth/me');

      if (!isAuthMe) {
        const { clearSession } = useAuthStore.getState();
        clearSession();

        const path = window.location.pathname;
        if (path.startsWith('/admin')) {
          window.location.href = '/admin/login';
        } else if (path.startsWith('/vendor')) {
          window.location.href = '/vendor/login';
        } else if (path.startsWith('/driver')) {
          window.location.href = '/driver/login';
        } else if (!path.startsWith('/login') && !path.startsWith('/register')) {
          window.location.href = '/login';
        }
      }
    }

  /** @type {ApiError} */
    const normalized = {
      message:
        data?.message ||
        data?.error ||
        error.message ||
        'An unexpected error occurred',
      status: status || 0,
      fieldErrors: data?.fieldErrors || data?.errors,
      raw: data,
    };

    return Promise.reject(normalized);
  },
);

export default apiClient;
