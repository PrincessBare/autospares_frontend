import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { USER_ROLES } from '../config/constants';

const CustomerRoute = ({ element }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === USER_ROLES.ADMIN) {
    return <Navigate to="/admin/products" replace />;
  }

  return element;
};

export default CustomerRoute;
