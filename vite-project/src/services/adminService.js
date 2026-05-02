import axiosInstance from './axiosInstance';
import {
  BRAND_ENDPOINTS,
  CATEGORY_ENDPOINTS,
  MODEL_ENDPOINTS,
  ORDER_ENDPOINTS,
  PRODUCT_ENDPOINTS,
  SUB_CATEGORY_ENDPOINTS,
  USER_ENDPOINTS,
} from '../config/api';

export const getAdminOrders = (page = 1, perPage = 100) =>
  axiosInstance.get(ORDER_ENDPOINTS.ADMIN_GET_ALL, { params: { page, perPage } });
export const deleteOrder = (id) => axiosInstance.delete(ORDER_ENDPOINTS.DELETE.replace(':id', id));
export const updateOrderStatus = (orderId, status) =>
  axiosInstance.put(ORDER_ENDPOINTS.UPDATE_STATUS.replace(':id', orderId), { status });

export const getUsers = (page = 1, perPage = 100, role) =>
  axiosInstance.get(USER_ENDPOINTS.GET_ALL, { params: { page, perPage, ...(role ? { role } : {}) } });
export const createUser = (payload) => axiosInstance.post(USER_ENDPOINTS.GET_ALL, payload);
export const updateUser = (id, payload) => axiosInstance.put(USER_ENDPOINTS.GET_BY_ID.replace(':id', id), payload);
export const deleteUser = (id) => axiosInstance.delete(USER_ENDPOINTS.GET_BY_ID.replace(':id', id));

export const createCategory = (payload) => axiosInstance.post(CATEGORY_ENDPOINTS.GET_ALL, payload);
export const createSubCategory = (payload) => axiosInstance.post(SUB_CATEGORY_ENDPOINTS.GET_ALL, payload);
export const createBrand = (payload) => axiosInstance.post(BRAND_ENDPOINTS.GET_ALL, payload);
export const createModel = (payload) => axiosInstance.post(MODEL_ENDPOINTS.GET_ALL, payload);
export const createProduct = (payload) => axiosInstance.post(PRODUCT_ENDPOINTS.GET_ALL, payload);

export const updateCategory = (id, payload) => axiosInstance.put(CATEGORY_ENDPOINTS.GET_BY_ID.replace(':id', id), payload);
export const updateSubCategory = (id, payload) => axiosInstance.put(SUB_CATEGORY_ENDPOINTS.GET_BY_ID.replace(':id', id), payload);
export const updateBrand = (id, payload) => axiosInstance.put(BRAND_ENDPOINTS.GET_BY_ID.replace(':id', id), payload);
export const updateModel = (id, payload) => axiosInstance.put(MODEL_ENDPOINTS.GET_BY_ID.replace(':id', id), payload);
export const updateProduct = (id, payload) => axiosInstance.put(PRODUCT_ENDPOINTS.GET_BY_ID.replace(':id', id), payload);

export const uploadProductImage = (productId, file) => {
  const formData = new FormData();
  formData.append('image', file);

  return axiosInstance.post(PRODUCT_ENDPOINTS.UPLOAD_IMAGE.replace(':id', productId), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteCategory = (id) => axiosInstance.delete(CATEGORY_ENDPOINTS.GET_BY_ID.replace(':id', id));
export const deleteSubCategory = (id) => axiosInstance.delete(SUB_CATEGORY_ENDPOINTS.GET_BY_ID.replace(':id', id));
export const deleteBrand = (id) => axiosInstance.delete(BRAND_ENDPOINTS.GET_BY_ID.replace(':id', id));
export const deleteModel = (id) => axiosInstance.delete(MODEL_ENDPOINTS.GET_BY_ID.replace(':id', id));
export const deleteProduct = (id) => axiosInstance.delete(PRODUCT_ENDPOINTS.GET_BY_ID.replace(':id', id));

export default {
  getAdminOrders,
  deleteOrder,
  updateOrderStatus,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  createCategory,
  createSubCategory,
  createBrand,
  createModel,
  createProduct,
  updateCategory,
  updateSubCategory,
  updateBrand,
  updateModel,
  updateProduct,
  uploadProductImage,
  deleteCategory,
  deleteSubCategory,
  deleteBrand,
  deleteModel,
  deleteProduct,
};
