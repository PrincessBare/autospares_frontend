import API_BASE_URL from '../config/api';

const BACKEND_ORIGIN = (() => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch (error) {
    return '';
  }
})();

export const resolveAssetUrl = (path) => {
  if (!path) {
    return '/placeholder.jpg';
  }

  if (/^(https?:)?\/\//i.test(path) || path.startsWith('data:')) {
    return path;
  }

  if (!BACKEND_ORIGIN) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${BACKEND_ORIGIN}${normalizedPath}`;
};

export default resolveAssetUrl;
