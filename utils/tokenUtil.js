/**
 * Token Utility Functions
 * Helper functions for managing JWT tokens
 */

import { STORAGE_KEYS } from '../config/constants';

/**
 * Get stored authentication token
 * @returns {String|null} JWT token or null if not exists
 */
export const getToken = () => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

/**
 * Set authentication token in localStorage
 * @param {String} token - JWT token to store
 */
export const setToken = (token) => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
};

/**
 * Remove authentication token from localStorage
 */
export const removeToken = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
};

/**
 * Check if token exists
 * @returns {Boolean} True if token exists
 */
export const hasToken = () => {
  return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
};

/**
 * Get user from localStorage
 * @returns {Object|null} User object or null
 */
export const getUser = () => {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Set user in localStorage
 * @param {Object} user - User object to store
 */
export const setUser = (user) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

/**
 * Clear all authentication data
 */
export const clearAuthData = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
};
