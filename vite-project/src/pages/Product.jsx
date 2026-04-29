import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { FiArrowRight, FiPackage, FiSearch } from 'react-icons/fi';
import Loading from '../components/Loading';
import ErrorAlert from '../components/ErrorAlert';
import { useAuth } from '../hooks/useAuth';
import productService from '../services/productService';
import { PAGINATION, USER_ROLES } from '../config/constants';
import { resolveAssetUrl } from '../utils/assetUrl';
import '../styles/Products.css';

const Products = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
  const isAdmin = user?.role === USER_ROLES.ADMIN;

  const filters = useMemo(() => ({
    categoryId: searchParams.get('category'),
    subCategoryId: searchParams.get('subCategory'),
    brandId: searchParams.get('brand'),
    modelId: searchParams.get('model'),
    query: searchParams.get('q'),
  }), [searchParams]);

  const filteredSubCategories = useMemo(() => {
    if (!filters.categoryId) return subCategories;
    return subCategories.filter((item) => String(item.category_id) === String(filters.categoryId));
  }, [filters.categoryId, subCategories]);

  const filteredModels = useMemo(() => {
    if (!filters.brandId) return models;
    return models.filter((item) => String(item.brand_id) === String(filters.brandId));
  }, [filters.brandId, models]);

  useEffect(() => {
    loadProducts();
  }, [searchParams, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchParams]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (filters.modelId) {
        response = await productService.getProductsByModel(filters.modelId, currentPage, PAGINATION.PAGE_SIZE);
      } else if (filters.brandId) {
        response = await productService.getProductsByBrand(filters.brandId, currentPage, PAGINATION.PAGE_SIZE);
      } else if (filters.subCategoryId) {
        response = await productService.getProductsBySubCategory(filters.subCategoryId, currentPage, PAGINATION.PAGE_SIZE);
      } else if (filters.categoryId) {
        response = await productService.getProductsByCategory(filters.categoryId, currentPage, PAGINATION.PAGE_SIZE);
      } else if (filters.query) {
        response = await productService.searchProducts(filters.query, currentPage, PAGINATION.PAGE_SIZE);
      } else {
        response = await productService.getAllProducts(currentPage, PAGINATION.PAGE_SIZE);
      }

      setProducts(response.data?.data || []);
      setTotalPages(response.data?.pagination?.totalPages || 1);

      if (currentPage === 1) {
        const [categoriesRes, subCategoriesRes, brandsRes, modelsRes] = await Promise.all([
          productService.getAllCategories(),
          productService.getAllSubCategories(),
          productService.getAllBrands(),
          productService.getAllModels(),
        ]);

        setCategories(categoriesRes.data?.data || []);
        setSubCategories(subCategoriesRes.data?.data || []);
        setBrands(brandsRes.data?.data || []);
        setModels(modelsRes.data?.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (updates) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    navigate(`/products${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    updateFilters({ q: searchInput.trim() || null });
  };

  const clearFilters = () => {
    setSearchInput('');
    navigate('/products');
  };

  if (isAdmin) {
    return <Navigate to="/admin/products" replace />;
  }

  if (loading && currentPage === 1) {
    return <Loading message="Loading products..." />;
  }

  return (
    <div className="container my-5">
      <div className="products-header mb-4">
        <div>
          <h1 className="h3 mb-1">Products</h1>
          <p className="text-muted mb-0">
            {isAdmin
              ? 'Review the current catalog and open the admin panel when you need to manage records.'
              : 'Browse the current inventory and filter by category, brand, and model.'}
          </p>
        </div>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      <div className="card products-controls mb-4">
        <div className="card-body">
          <form className="row g-3 align-items-end" onSubmit={handleSearch}>
            <div className="col-lg-4">
              <label className="form-label">Search</label>
              <div className="input-group">
                <span className="input-group-text bg-white"><FiSearch /></span>
                <input
                  className="form-control"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search products"
                />
              </div>
            </div>
            <div className="col-md-6 col-lg-2">
              <label className="form-label">Category</label>
              <select className="form-select" value={filters.categoryId || ''} onChange={(e) => updateFilters({ category: e.target.value || null, subCategory: null })}>
                <option value="">All</option>
                {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </div>
            <div className="col-md-6 col-lg-2">
              <label className="form-label">Sub-category</label>
              <select className="form-select" value={filters.subCategoryId || ''} onChange={(e) => updateFilters({ subCategory: e.target.value || null })}>
                <option value="">All</option>
                {filteredSubCategories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </div>
            <div className="col-md-6 col-lg-2">
              <label className="form-label">Brand</label>
              <select className="form-select" value={filters.brandId || ''} onChange={(e) => updateFilters({ brand: e.target.value || null, model: null })}>
                <option value="">All</option>
                {brands.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </div>
            <div className="col-md-6 col-lg-2">
              <label className="form-label">Model</label>
              <select className="form-select" value={filters.modelId || ''} onChange={(e) => updateFilters({ model: e.target.value || null })}>
                <option value="">All</option>
                {filteredModels.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </div>
            <div className="col-12 d-flex gap-2">
              <button className="btn btn-primary" type="submit">Apply</button>
              <button className="btn btn-outline-secondary" type="button" onClick={clearFilters}>Reset</button>
            </div>
          </form>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <p className="text-muted mb-0">{products.length} product(s) on this page</p>
        {isAdmin ? (
          <Link to="/admin/products" className="btn btn-outline-secondary btn-sm">Open Admin Panel</Link>
        ) : (
          <Link to="/cart" className="btn btn-outline-primary btn-sm">View Cart</Link>
        )}
      </div>

      <div className="row g-4">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="col-sm-6 col-xl-4">
              <Link to={`/product/${product.id}`} className="text-decoration-none d-block h-100">
                <article className="product-card card h-100">
                  <div className="product-image bg-light d-flex align-items-center justify-content-center">
                    <img
                      src={resolveAssetUrl(product.img)}
                      alt={product.name}
                      className="img-fluid product-image-tag"
                    />
                  </div>
                  <div className="card-body d-flex flex-column">
                    <div className="product-meta-top mb-2">
                      <span>{product.category_name || 'Auto Parts'}</span>
                      {product.brand_name && <span>{product.brand_name}</span>}
                    </div>
                    <h2 className="h6 text-dark fw-bold mb-2 product-name">{product.name}</h2>
                    <p className="text-muted small mb-3 product-description">
                      {product.description?.substring(0, 90) || 'No description provided.'}
                    </p>
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center product-meta">
                        <span className="h5 text-primary fw-bold mb-0">${Number(product.price || 0).toFixed(2)}</span>
                        <small className={`stock-badge ${Number(product.stock_quantity) > 0 ? 'in-stock' : 'out-stock'}`}>
                          <FiPackage className="me-1" />
                          {Number(product.stock_quantity) > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
                        </small>
                      </div>
                      <div className="product-view-link mt-3">
                        View product <FiArrowRight className="ms-1" />
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="card">
              <div className="card-body text-center py-5">
                <h2 className="h5">No products found</h2>
                <p className="text-muted mb-3">Try changing the current filters or search term.</p>
                <button className="btn btn-outline-primary" onClick={clearFilters}>Clear filters</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <nav aria-label="Page navigation" className="mt-5">
          <ul className="pagination justify-content-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(page)}>
                  {page}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Products;
