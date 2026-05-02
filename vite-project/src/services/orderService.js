import axiosInstance from './axiosInstance';
import { ORDER_ENDPOINTS } from '../config/api';

export const createOrder = (orderData) => {
  return axiosInstance.post(ORDER_ENDPOINTS.CREATE, orderData);
};

export const getAllOrders = () => {
  return axiosInstance.get(ORDER_ENDPOINTS.GET_ALL);
};

export const getOrderById = (orderId) => {
  return axiosInstance.get(ORDER_ENDPOINTS.GET_BY_ID.replace(':id', orderId));
};

export default {
  createOrder,
  getAllOrders,
  getOrderById,
};
