import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
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
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isAdmin = user?.role === USER_ROLES.ADMIN;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

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
      <section className="hero-section py-5">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <h1 className="display-5 fw-bold mb-3">Auto parts made simple</h1>
              <div className="d-flex flex-wrap gap-2">
                <Link to={isAdmin ? '/admin/products' : '/products'} className="btn btn-primary btn-lg">
                  {isAdmin ? 'Admin' : 'Shop'} <FiArrowRight className="ms-2" />
                </Link>
                <Link to={isAdmin ? '/products' : '/orders'} className="btn btn-outline-primary btn-lg">
                  {isAdmin ? 'Catalog' : 'Orders'}
                </Link>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="hero-benefits card p-4">
                <strong>Find parts. Add to cart. Place your order.</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mb-4">
        <div className="row g-3">
          <div className="col-md-4"><div className="trust-item card p-3"><strong>Quality parts</strong></div></div>
          <div className="col-md-4"><div className="trust-item card p-3"><strong>Fast orders</strong></div></div>
          <div className="col-md-4"><div className="trust-item card p-3"><strong>Clear prices</strong></div></div>
        </div>
      </section>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      <div className="container my-5">
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
                    <div className="product-image bg-light d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                      <img
                        src={resolveAssetUrl(product.img)}
                        alt={product.name}
                        className="img-fluid"
                        style={{ maxHeight: '100%', objectFit: 'contain' }}
                      />
                    </div>

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
