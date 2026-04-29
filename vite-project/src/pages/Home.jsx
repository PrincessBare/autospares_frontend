/**
 * Home Page Component
 * Landing page with featured products and categories
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiGrid, FiShield, FiTruck } from 'react-icons/fi';
import Loading from '../components/Loading';
import ErrorAlert from '../components/ErrorAlert';
import { useAuth } from '../hooks/useAuth';
import { USER_ROLES } from '../config/constants';
import productService from '../services/productService';
import { resolveAssetUrl } from '../utils/assetUrl';
import '../styles/Home.css';

const Home = () => {
  const formatMoney = (value) => Number(value || 0).toFixed(2);
  const { user } = useAuth();
  // State management
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isAdmin = user?.role === USER_ROLES.ADMIN;

  /**
   * Fetch featured products and categories on component mount
   */
  useEffect(() => {
    fetchData();
  }, []);

  /**
   * Fetch products and categories from API
   */
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch products and categories in parallel
      const [productsRes, categoriesRes] = await Promise.all([
        productService.getAllProducts(1, 8),
        productService.getAllCategories(),
      ]);

      setProducts(productsRes.data.data || []);
      setCategories(categoriesRes.data.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || 'Failed to load page');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Loading featured products..." />;

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section py-5">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <h1 className="display-5 fw-bold mb-3">Premium Auto Parts, Delivered Fast</h1>
              <p className="lead mb-4 text-secondary">
                {isAdmin
                  ? 'Review the live catalog and keep products, categories, brands, and models up to date.'
                  : 'Discover high-quality components by category and find the right fit for your vehicle.'}
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Link to={isAdmin ? '/admin/products' : '/products'} className="btn btn-primary btn-lg">
                  {isAdmin ? 'Open admin panel' : 'Shop collection'} <FiArrowRight className="ms-2" />
                </Link>
                <Link to={isAdmin ? '/products' : '/orders'} className="btn btn-outline-primary btn-lg">
                  {isAdmin ? 'Review catalog' : 'Track orders'}
                </Link>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="hero-benefits card p-4">
                <div className="d-flex align-items-center mb-3"><FiTruck className="me-2 text-primary" /> Reliable nationwide shipping</div>
                <div className="d-flex align-items-center mb-3"><FiShield className="me-2 text-primary" /> Secure checkout and order records</div>
                <div className="d-flex align-items-center"><FiGrid className="me-2 text-primary" /> Organized product catalog</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mb-4">
        <div className="row g-3">
          <div className="col-md-4"><div className="trust-item card p-3"><strong>Quality first</strong><span className="text-muted small">Tested inventory and clear product details</span></div></div>
          <div className="col-md-4"><div className="trust-item card p-3"><strong>{isAdmin ? 'Catalog control' : 'Fast service'}</strong><span className="text-muted small">{isAdmin ? 'Manage core catalog records from one admin workspace' : 'Simple ordering from browse to checkout'}</span></div></div>
          <div className="col-md-4"><div className="trust-item card p-3"><strong>{isAdmin ? 'Clear structure' : 'Transparent pricing'}</strong><span className="text-muted small">{isAdmin ? 'Products stay linked to categories, brands, and models' : 'Clear totals and stock visibility'}</span></div></div>
        </div>
      </section>

      {/* Error Alert */}
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      <div className="container my-5">
        {/* Featured Categories */}
        <section className="mb-5">
          <h2 className="h3 fw-bold mb-4">Shop by Category</h2>
          <div className="row">
            {categories.slice(0, 6).map((category) => (
              <div key={category.id} className="col-md-4 col-lg-2 col-sm-6 mb-3">
                <Link
                  to={`/products?category=${category.id}`}
                  className="text-decoration-none"
                >
                  <div className="category-card p-3 text-center border rounded h-100">
                    <h6 className="text-dark fw-bold mb-1">{category.name}</h6>
                    <small className="text-muted">
                      {category.description}
                    </small>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h3 fw-bold mb-0">Featured Products</h2>
            <Link to="/products" className="btn btn-outline-primary">See all</Link>
          </div>
          <div className="row">
            {products.map((product) => (
              <div key={product.id} className="col-md-6 col-lg-3 mb-4">
                <Link
                  to={`/product/${product.id}`}
                  className="text-decoration-none"
                >
                  <div className="product-card card h-100">
                    {/* Product Image */}
                    <div className="product-image bg-light d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                      <img
                        src={resolveAssetUrl(product.img)}
                        alt={product.name}
                        className="img-fluid"
                        style={{ maxHeight: '100%', objectFit: 'contain' }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="card-body d-flex flex-column">
                      <h6 className="card-title text-dark fw-bold mb-2">
                        {product.name}
                      </h6>
                      <p className="text-muted small mb-3">
                        {product.description?.substring(0, 55)}...
                      </p>

                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="h5 text-primary fw-bold mb-0">
                            ${formatMoney(product.price)}
                          </span>
                          <small className="text-muted">Stock {product.stock_quantity ?? 'N/A'}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-3">
            <Link to="/products" className="btn btn-primary btn-lg">
              Browse full catalog
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
