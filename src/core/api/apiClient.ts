import axios from 'axios';

import { env } from '../config/env';
import { tokenStorage } from '../storage/tokenStorage';

// apiClient is the shared Axios instance for all backend requests.
// It automatically adds Authorization header if access token exists.
export const apiClient = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await tokenStorage.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});