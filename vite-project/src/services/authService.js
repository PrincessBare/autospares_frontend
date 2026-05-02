import axiosInstance from './axiosInstance';
import { AUTH_ENDPOINTS } from '../config/api';
export const registerUser = (userData) => {
  return axiosInstance.post(AUTH_ENDPOINTS.REGISTER, userData);
};
export const loginUser = (credentials) => {
  return axiosInstance.post(AUTH_ENDPOINTS.LOGIN, credentials);
};

export default {
  registerUser,
  loginUser,
};
