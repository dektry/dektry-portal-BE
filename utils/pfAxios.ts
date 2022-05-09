import axios from 'axios';

export const PFAxios = axios.create({
  baseURL: process.env.PF_API,
});

PFAxios.interceptors.request.use(
  (config) => {
    config.headers['X-API-KEY'] = process.env.PF_API_KEY;

    return config;
  },
  (error) => Promise.reject(error),
);
