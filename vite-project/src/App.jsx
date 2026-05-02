import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import AdminRoute from './components/AdminRoute';
import CustomerRoute from './components/CustomerRoute';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-wrapper d-flex flex-column" style={{ minHeight: '100vh' }}>
        <Navigation />

        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/checkout"
              element={<CustomerRoute element={<Checkout />} />}
            />
            <Route
              path="/orders"
              element={<CustomerRoute element={<Orders />} />}
            />
            <Route
              path="/admin"
              element={<AdminRoute element={<AdminLayout />} />}
            >
              <Route index element={<Navigate to="products" replace />} />
              <Route path="products" element={<AdminDashboard section="products" />} />
              <Route path="categories" element={<AdminDashboard section="categories" />} />
              <Route path="sub-categories" element={<AdminDashboard section="subCategories" />} />
              <Route path="brands" element={<AdminDashboard section="brands" />} />
              <Route path="models" element={<AdminDashboard section="models" />} />
              <Route path="orders" element={<AdminDashboard section="orders" />} />
              <Route path="users" element={<AdminDashboard section="users" />} />
            </Route>
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
