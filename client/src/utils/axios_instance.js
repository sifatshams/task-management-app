import axios from 'axios';
import { BASE_URL } from './api_path';

// create axios instance
const axios_instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// request interceptor
axios_instance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// response interceptor
axios_instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // handle unauthorized (401)
    if (status === 401) {
      localStorage.removeItem('token'); // remove old token

      // redirect and check
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // custom error format
    const customError = {
      message:
        error.response?.data?.message ||
        (error.code === 'ECONNABORTED'
          ? 'Request timeout. Please check your connection!'
          : 'An unexpected error occurred. Please try again!'),
      status: status || null,
      rawError: error,
    };

    return Promise.reject(customError);
  },
);

export default axios_instance;
