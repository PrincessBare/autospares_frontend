import axiosInstance from './axiosInstance';
import {
  PRODUCT_ENDPOINTS,
  CATEGORY_ENDPOINTS,
  SUB_CATEGORY_ENDPOINTS,
  BRAND_ENDPOINTS,
  MODEL_ENDPOINTS,
} from '../config/api';
export const getAllProducts = (page = 1, limit = 12) => {
  return axiosInstance.get(PRODUCT_ENDPOINTS.GET_ALL, {
    params: { page, limit },
  });
};
export const getProductById = (productId) => {
  return axiosInstance.get(PRODUCT_ENDPOINTS.GET_BY_ID.replace(':id', productId));
};
export const getProductsByCategory = (categoryId, page = 1, limit = 12) => {
  return axiosInstance.get(PRODUCT_ENDPOINTS.GET_ALL, {
    params: { page, perPage: limit, categoryId },
  });
};

export const getProductsBySubCategory = (subCategoryId, page = 1, limit = 12) => {
  return axiosInstance.get(PRODUCT_ENDPOINTS.GET_ALL, {
    params: { page, perPage: limit, subCategoryId },
  });
};

export const getProductsByBrand = (brandId, page = 1, limit = 12) => {
  return axiosInstance.get(PRODUCT_ENDPOINTS.GET_ALL, {
    params: { page, perPage: limit, brandId },
  });
};

export const getProductsByModel = (modelId, page = 1, limit = 12) => {
  return axiosInstance.get(PRODUCT_ENDPOINTS.GET_ALL, {
    params: { page, perPage: limit, modelId },
  });
};
export const searchProducts = (query, page = 1, perPage = 12) => {
  return axiosInstance.get(PRODUCT_ENDPOINTS.SEARCH, {
    params: { q: query, page, perPage },
  });
};
export const getAllCategories = () => {
  return axiosInstance.get(CATEGORY_ENDPOINTS.GET_ALL);
};

export const getAllSubCategories = (categoryId) => {
  return axiosInstance.get(SUB_CATEGORY_ENDPOINTS.GET_ALL, {
    params: categoryId ? { categoryId } : {},
  });
};

export const getAllBrands = () => {
  return axiosInstance.get(BRAND_ENDPOINTS.GET_ALL);
};

export const getAllModels = (brandId) => {
  return axiosInstance.get(MODEL_ENDPOINTS.GET_ALL, {
    params: brandId ? { brandId } : {},
  });
};

export default {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getProductsBySubCategory,
  getProductsByBrand,
  getProductsByModel,
  searchProducts,
  getAllCategories,
  getAllSubCategories,
  getAllBrands,
  getAllModels,
};
