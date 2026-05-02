import React from 'react';
import { Outlet } from 'react-router-dom';
import '../styles/Admin.css';

const AdminLayout = () => {
  return (
    <div className="container my-4 admin-layout">
      <Outlet />
    </div>
  );
};

export default AdminLayout;
