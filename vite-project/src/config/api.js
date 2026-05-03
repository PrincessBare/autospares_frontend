const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://autospares-backend.onrender.com/api';

export const AUTH_ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/profile',
};

export const PRODUCT_ENDPOINTS = {
  GET_ALL: '/products',
  GET_BY_ID: '/products/:id',
  SEARCH: '/products/search',
  UPLOAD_IMAGE: '/products/:id/image',
};

export const CATEGORY_ENDPOINTS = {
  GET_ALL: '/categories',
  GET_BY_ID: '/categories/:id',
  SEARCH: '/categories/search',
};

export const SUB_CATEGORY_ENDPOINTS = {
  GET_ALL: '/sub-categories',
  GET_BY_ID: '/sub-categories/:id',
};

export const BRAND_ENDPOINTS = {
  GET_ALL: '/brands',
  GET_BY_ID: '/brands/:id',
};

export const MODEL_ENDPOINTS = {
  GET_ALL: '/models',
  GET_BY_ID: '/models/:id',
};

export const ORDER_ENDPOINTS = {
  CREATE: '/orders',
  ADMIN_GET_ALL: '/orders',
  GET_ALL: '/orders/my',
  GET_BY_ID: '/orders/:id',
  UPDATE_STATUS: '/orders/:id/status',
  DELETE: '/orders/:id',
};

export const USER_ENDPOINTS = {
  GET_ALL: '/users',
  GET_BY_ID: '/users/:id',
};

export default API_BASE_URL;
