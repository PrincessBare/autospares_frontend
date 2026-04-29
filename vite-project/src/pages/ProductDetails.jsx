
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { FiCheckCircle, FiShoppingCart, FiTag } from 'react-icons/fi';
import Loading from '../components/Loading';
import ErrorAlert from '../components/ErrorAlert';
import { useAuth } from '../hooks/useAuth';
import { USER_ROLES } from '../config/constants';
import { useCartStore } from '../stores/cartStore';
import productService from '../services/productService';
import { resolveAssetUrl } from '../utils/assetUrl';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
  const formatMoney = (value) => Number(value || 0).toFixed(2);
  // URL parameters and navigation
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State management
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);

  // Cart store
  const addItem = useCartStore((state) => state.addItem);
  const isAdmin = user?.role === USER_ROLES.ADMIN;

  if (isAdmin) {
    return <Navigate to="/admin/products" replace />;
  }

  
  useEffect(() => {
    fetchProduct();
  }, [id]);

  /**
   * Fetch single product from API
   */
  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getProductById(id);
      setProduct(response.data.data);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.response?.data?.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle add to cart action
   */
  const handleAddToCart = () => {
    if (product && quantity > 0) {
      addItem(product, quantity);
      setAddedToCart(true);
      
      // Reset message after 2 seconds
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  if (loading) return <Loading message="Loading product..." />;

  if (!product) {
    return (
      <div className="container my-5 text-center">
        <p className="text-danger">Product not found</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      <div className="row">
        {/* Product Image */}
        <div className="col-md-6 mb-4">
          <div className="bg-light p-4 rounded" style={{ minHeight: '400px' }}>
            <img
              src={resolveAssetUrl(product.img)}
              alt={product.name}
              className="img-fluid"
              style={{ maxHeight: '400px', objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="col-md-6">
          {/* Title */}
          <h1 className="h2 fw-bold mb-2">{product.name}</h1>

          {/* Price */}
          <div className="mb-4">
            <h3 className="text-primary fw-bold"><FiTag className="me-2" />${formatMoney(product.price)}</h3>
          </div>

          {/* Description */}
          <p className="text-muted mb-4">{product.description}</p>

          {/* Product Info Grid */}
          <div className="row mb-4 bg-light p-3 rounded">
            <div className="col-6">
              <small className="text-muted">Stock Available</small>
              <p className="fw-bold">{product.stock_quantity || 'In Stock'}</p>
            </div>
            <div className="col-6">
              <small className="text-muted">Category</small>
              <p className="fw-bold">{product.category_name || 'Auto Parts'}</p>
            </div>
            <div className="col-6">
              <small className="text-muted">Brand</small>
              <p className="fw-bold">{product.brand_name || 'N/A'}</p>
            </div>
            <div className="col-6">
              <small className="text-muted">Model</small>
              <p className="fw-bold">{product.model_name || 'N/A'}</p>
            </div>
          </div>

          {!isAdmin ? (
            <>
              <div className="mb-4">
                <label className="form-label fw-bold">Quantity</label>
                <div className="input-group" style={{ maxWidth: '150px' }}>
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    className="form-control text-center"
                    value={quantity}
                    readOnly
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <button
                  className="btn btn-primary btn-lg w-100 fw-bold"
                  onClick={handleAddToCart}
                >
                  <FiShoppingCart className="me-2" />
                  Add to Cart
                </button>
              </div>

              {addedToCart && (
                <div className="alert alert-success">
                  <FiCheckCircle className="me-2" />
                  Added to cart successfully.
                </div>
              )}
            </>
          ) : (
            <div className="alert alert-secondary mb-4">
              Admin accounts can review inventory details here, but shopping actions are disabled.
            </div>
          )}

          <button
            className="btn btn-outline-secondary w-100"
            onClick={() => navigate('/products')}
          >
            {isAdmin ? 'Back to Catalog' : 'Continue Shopping'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
