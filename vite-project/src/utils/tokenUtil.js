import { STORAGE_KEYS } from '../config/constants';
export const getToken = () => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};
export const setToken = (token) => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
};
export const removeToken = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
};
export const hasToken = () => {
  return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
};
export const getUser = () => {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  return userStr ? JSON.parse(userStr) : null;
};
export const setUser = (user) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};
export const clearAuthData = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
};
