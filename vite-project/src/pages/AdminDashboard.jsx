import React, { useEffect, useMemo, useState } from 'react';
import AdminModal from '../components/AdminModal';
import ErrorAlert from '../components/ErrorAlert';
import Loading from '../components/Loading';
import { USER_ROLES } from '../config/constants';
import adminService from '../services/adminService';
import orderService from '../services/orderService';
import productService from '../services/productService';
import '../styles/Admin.css';

const ORDER_STATUSES = ['Pending', 'Completed', 'Canceled', 'Failed'];

const initialProductForm = {
  name: '',
  description: '',
  price: '',
  stockQuantity: '',
  subCategoryId: '',
  brandId: '',
  modelId: '',
  image: '',
};

const initialCategoryForm = { name: '', description: '' };
const initialSubCategoryForm = { categoryId: '', name: '', description: '' };
const initialBrandForm = { name: '' };
const initialModelForm = { brandId: '', name: '' };
const initialUserForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phoneNumber: '',
  address: '',
  city: '',
  country: '',
  role: USER_ROLES.CUSTOMER,
};
const initialOrderForm = { status: ORDER_STATUSES[0] };

const AdminDashboard = ({ section = 'products' }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [modal, setModal] = useState({ type: null, mode: 'create', item: null });
  const [productForm, setProductForm] = useState(initialProductForm);
  const [categoryForm, setCategoryForm] = useState(initialCategoryForm);
  const [subCategoryForm, setSubCategoryForm] = useState(initialSubCategoryForm);
  const [brandForm, setBrandForm] = useState(initialBrandForm);
  const [modelForm, setModelForm] = useState(initialModelForm);
  const [userForm, setUserForm] = useState(initialUserForm);
  const [orderForm, setOrderForm] = useState(initialOrderForm);
  const [productImageFile, setProductImageFile] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [catalog, setCatalog] = useState({
    products: [],
    categories: [],
    subCategories: [],
    brands: [],
    models: [],
    orders: [],
    users: [],
  });

  const filteredProductModels = useMemo(() => {
    if (!productForm.brandId) {
      return catalog.models;
    }

    return catalog.models.filter((item) => String(item.brand_id) === String(productForm.brandId));
  }, [catalog.models, productForm.brandId]);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        productsRes,
        categoriesRes,
        subCategoriesRes,
        brandsRes,
        modelsRes,
        ordersRes,
        usersRes,
      ] = await Promise.all([
        productService.getAllProducts(1, 100),
        productService.getAllCategories(),
        productService.getAllSubCategories(),
        productService.getAllBrands(),
        productService.getAllModels(),
        adminService.getAdminOrders(),
        adminService.getUsers(),
      ]);

      setCatalog({
        products: productsRes.data?.data || [],
        categories: categoriesRes.data?.data || [],
        subCategories: subCategoriesRes.data?.data || [],
        brands: brandsRes.data?.data || [],
        models: modelsRes.data?.data || [],
        orders: ordersRes.data?.data || [],
        users: usersRes.data?.data || [],
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModal({ type: null, mode: 'create', item: null });
    setProductImageFile(null);
    setValidationErrors({});
  };

  const setFieldError = (field) => {
    setValidationErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }

      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const getFieldClass = (field) => (
    validationErrors[field] ? 'form-control is-invalid' : 'form-control'
  );

  const getSelectClass = (field) => (
    validationErrors[field] ? 'form-select is-invalid' : 'form-select'
  );

  const renderFieldError = (field) => (
    validationErrors[field] ? <div className="invalid-feedback d-block">{validationErrors[field]}</div> : null
  );

  const openProductModal = (mode, item = null) => {
    let brandId = '';
    if (item?.model_id) {
      const matchingModel = catalog.models.find((model) => String(model.id) === String(item.model_id));
      brandId = matchingModel?.brand_id ? String(matchingModel.brand_id) : '';
    }

    setProductForm(
      item
        ? {
            name: item.name || '',
            description: item.description || '',
            price: item.price ?? '',
            stockQuantity: item.stock_quantity ?? '',
            subCategoryId: item.sub_category_id ? String(item.sub_category_id) : '',
            brandId,
            modelId: item.model_id ? String(item.model_id) : '',
            image: item.img || '',
          }
        : initialProductForm
    );
    setValidationErrors({});
    setModal({ type: 'product', mode, item });
  };

  const openCategoryModal = (type, mode, item = null) => {
    if (type === 'category') {
      setCategoryForm(item ? { name: item.name || '', description: item.description || '' } : initialCategoryForm);
    }
    if (type === 'subCategory') {
      setSubCategoryForm(
        item
          ? {
              categoryId: item.category_id ? String(item.category_id) : '',
              name: item.name || '',
              description: item.description || '',
            }
          : initialSubCategoryForm
      );
    }
    if (type === 'brand') {
      setBrandForm(item ? { name: item.name || '' } : initialBrandForm);
    }
    if (type === 'model') {
      setModelForm(
        item
          ? {
              brandId: item.brand_id ? String(item.brand_id) : '',
              name: item.name || '',
            }
          : initialModelForm
      );
    }

    setValidationErrors({});
    setModal({ type, mode, item });
  };

  const openUserModal = (mode, item = null) => {
    setUserForm(
      item
        ? {
            firstName: item.firstName || '',
            lastName: item.lastName || '',
            email: item.email || '',
            password: '',
            phoneNumber: item.phoneNumber || '',
            address: item.address || '',
            city: item.city || '',
            country: item.country || '',
            role: item.role || USER_ROLES.CUSTOMER,
          }
        : initialUserForm
    );
    setValidationErrors({});
    setModal({ type: 'user', mode, item });
  };

  const openOrderModal = async (mode, item) => {
    setOrderForm({ status: item.status || ORDER_STATUSES[0] });
    setValidationErrors({});

    try {
      const response = await orderService.getOrderById(item.id);
      setModal({ type: 'order', mode, item: response.data?.data || item });
    } catch (err) {
      setModal({ type: 'order', mode, item });
    }
  };

  const openDeleteModal = (entityType, item) => {
    setValidationErrors({});
    setModal({ type: 'delete', mode: 'delete', item: { ...item, entityType } });
  };

  const openViewModal = (type, item) => {
    setValidationErrors({});
    setModal({ type, mode: 'view', item });
  };

  const validateCurrentModal = () => {
    const errors = {};

    if (modal.type === 'product') {
      if (!productForm.name.trim()) errors.productName = 'Product name is required.';
      if (!productForm.price || Number(productForm.price) <= 0) errors.productPrice = 'Enter a valid product price.';
      if (productForm.stockQuantity === '' || Number(productForm.stockQuantity) < 0) errors.productStock = 'Enter a valid stock quantity.';
      if (!productForm.subCategoryId) errors.productSubCategory = 'Select a sub-category.';
      if (!productForm.brandId) errors.productBrand = 'Select a brand.';
      if (!productForm.modelId) errors.productModel = 'Select a model.';
    }

    if (modal.type === 'category') {
      if (!categoryForm.name.trim()) errors.categoryName = 'Category name is required.';
    }

    if (modal.type === 'subCategory') {
      if (!subCategoryForm.categoryId) errors.subCategoryCategory = 'Select a category.';
      if (!subCategoryForm.name.trim()) errors.subCategoryName = 'Sub-category name is required.';
    }

    if (modal.type === 'brand') {
      if (!brandForm.name.trim()) errors.brandName = 'Brand name is required.';
    }

    if (modal.type === 'model') {
      if (!modelForm.brandId) errors.modelBrand = 'Select a brand.';
      if (!modelForm.name.trim()) errors.modelName = 'Model name is required.';
    }

    if (modal.type === 'user') {
      if (!userForm.firstName.trim()) errors.userFirstName = 'First name is required.';
      if (!userForm.lastName.trim()) errors.userLastName = 'Last name is required.';
      if (!userForm.email.trim()) {
        errors.userEmail = 'Email is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email)) {
        errors.userEmail = 'Enter a valid email address.';
      }
      if (modal.mode === 'create' && !userForm.password) {
        errors.userPassword = 'Password is required.';
      } else if (userForm.password && userForm.password.length < 6) {
        errors.userPassword = 'Password must be at least 6 characters.';
      }
      if (!userForm.role) {
        errors.userRole = 'Select a role.';
      }
    }

    if (modal.type === 'order' && !orderForm.status) {
      errors.orderStatus = 'Select an order status.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProductSave = async () => {
    if (modal.mode === 'edit' && modal.item) {
      await adminService.updateProduct(modal.item.id, productForm);
      if (productImageFile) {
        await adminService.uploadProductImage(modal.item.id, productImageFile);
      }
      setSuccess('Product updated successfully.');
      return;
    }

    const response = await adminService.createProduct(productForm);
    const productId = response.data?.data?.id;
    if (productId && productImageFile) {
      await adminService.uploadProductImage(productId, productImageFile);
    }
    setSuccess('Product created successfully.');
  };

  const handleEntitySave = async () => {
    if (modal.type === 'category') {
      if (modal.mode === 'edit' && modal.item) {
        await adminService.updateCategory(modal.item.id, categoryForm);
        setSuccess('Category updated successfully.');
      } else {
        await adminService.createCategory(categoryForm);
        setSuccess('Category created successfully.');
      }
      return;
    }

    if (modal.type === 'subCategory') {
      if (modal.mode === 'edit' && modal.item) {
        await adminService.updateSubCategory(modal.item.id, subCategoryForm);
        setSuccess('Sub-category updated successfully.');
      } else {
        await adminService.createSubCategory(subCategoryForm);
        setSuccess('Sub-category created successfully.');
      }
      return;
    }

    if (modal.type === 'brand') {
      if (modal.mode === 'edit' && modal.item) {
        await adminService.updateBrand(modal.item.id, brandForm);
        setSuccess('Brand updated successfully.');
      } else {
        await adminService.createBrand(brandForm);
        setSuccess('Brand created successfully.');
      }
      return;
    }

    if (modal.type === 'model') {
      if (modal.mode === 'edit' && modal.item) {
        await adminService.updateModel(modal.item.id, modelForm);
        setSuccess('Model updated successfully.');
      } else {
        await adminService.createModel(modelForm);
        setSuccess('Model created successfully.');
      }
      return;
    }

    if (modal.type === 'user') {
      if (modal.mode === 'edit' && modal.item) {
        const payload = { ...userForm };
        if (!payload.password) {
          delete payload.password;
        }
        await adminService.updateUser(modal.item.id, payload);
        setSuccess('User updated successfully.');
      } else {
        await adminService.createUser(userForm);
        setSuccess('User created successfully.');
      }
      return;
    }

    if (modal.type === 'order' && modal.item) {
      await adminService.updateOrderStatus(modal.item.id, orderForm.status);
      setSuccess('Order updated successfully.');
      return;
    }
  };

  const handleModalSave = async () => {
    if (!validateCurrentModal()) {
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (modal.type === 'product') {
        await handleProductSave();
      } else {
        await handleEntitySave();
      }

      closeModal();
      await loadAdminData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save admin changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!modal.item?.entityType) {
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const { entityType, id } = modal.item;
      const actions = {
        product: () => adminService.deleteProduct(id),
        category: () => adminService.deleteCategory(id),
        subCategory: () => adminService.deleteSubCategory(id),
        brand: () => adminService.deleteBrand(id),
        model: () => adminService.deleteModel(id),
        order: () => adminService.deleteOrder(id),
        user: () => adminService.deleteUser(id),
      };

      await actions[entityType]();
      setSuccess(`${entityType} deleted successfully.`);
      closeModal();
      await loadAdminData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete item.');
    } finally {
      setSaving(false);
    }
  };

  const renderFormModalBody = () => {
    if (modal.mode === 'view' && modal.item) {
      if (modal.type === 'product') {
        return (
          <div className="admin-detail-grid">
            <div><strong>Name:</strong> {modal.item.name}</div>
            <div><strong>Price:</strong> ${Number(modal.item.price || 0).toFixed(2)}</div>
            <div><strong>Stock:</strong> {modal.item.stock_quantity}</div>
            <div><strong>Category:</strong> {modal.item.category_name || 'N/A'}</div>
            <div><strong>Sub-category:</strong> {modal.item.sub_category_name || 'N/A'}</div>
            <div><strong>Brand:</strong> {modal.item.brand_name || 'N/A'}</div>
            <div><strong>Model:</strong> {modal.item.model_name || 'N/A'}</div>
            <div className="admin-grid-span"><strong>Description:</strong> {modal.item.description || 'No description'}</div>
            <div className="admin-grid-span"><strong>Image URL:</strong> {modal.item.img || 'No image'}</div>
          </div>
        );
      }

      if (modal.type === 'category') {
        return (
          <div className="admin-detail-grid">
            <div><strong>Name:</strong> {modal.item.name}</div>
            <div><strong>ID:</strong> #{modal.item.id}</div>
            <div className="admin-grid-span"><strong>Description:</strong> {modal.item.description || 'No description'}</div>
          </div>
        );
      }

      if (modal.type === 'subCategory') {
        return (
          <div className="admin-detail-grid">
            <div><strong>Name:</strong> {modal.item.name}</div>
            <div><strong>Parent category:</strong> {modal.item.category_name || 'N/A'}</div>
            <div><strong>ID:</strong> #{modal.item.id}</div>
            <div className="admin-grid-span"><strong>Description:</strong> {modal.item.description || 'No description'}</div>
          </div>
        );
      }

      if (modal.type === 'brand') {
        return (
          <div className="admin-detail-grid">
            <div><strong>Name:</strong> {modal.item.name}</div>
            <div><strong>Models:</strong> {modal.item.model_count || 0}</div>
            <div><strong>ID:</strong> #{modal.item.id}</div>
          </div>
        );
      }

      if (modal.type === 'model') {
        return (
          <div className="admin-detail-grid">
            <div><strong>Name:</strong> {modal.item.name}</div>
            <div><strong>Brand:</strong> {modal.item.brand_name || 'N/A'}</div>
            <div><strong>ID:</strong> #{modal.item.id}</div>
          </div>
        );
      }
    }

    if (modal.type === 'product') {
      return (
        <div className="admin-form-grid admin-form-grid-wide">
          <div>
            <label className="form-label">Product name</label>
            <input className={getFieldClass('productName')} value={productForm.name} onChange={(e) => {
              setProductForm((prev) => ({ ...prev, name: e.target.value }));
              setFieldError('productName');
            }} />
            {renderFieldError('productName')}
          </div>
          <div>
            <label className="form-label">Price</label>
            <input className={getFieldClass('productPrice')} type="number" value={productForm.price} onChange={(e) => {
              setProductForm((prev) => ({ ...prev, price: e.target.value }));
              setFieldError('productPrice');
            }} />
            {renderFieldError('productPrice')}
          </div>
          <div>
            <label className="form-label">Stock</label>
            <input className={getFieldClass('productStock')} type="number" value={productForm.stockQuantity} onChange={(e) => {
              setProductForm((prev) => ({ ...prev, stockQuantity: e.target.value }));
              setFieldError('productStock');
            }} />
            {renderFieldError('productStock')}
          </div>
          <div>
            <label className="form-label">Sub-category</label>
            <select className={getSelectClass('productSubCategory')} value={productForm.subCategoryId} onChange={(e) => {
              setProductForm((prev) => ({ ...prev, subCategoryId: e.target.value }));
              setFieldError('productSubCategory');
            }}>
              <option value="">Select sub-category</option>
              {catalog.subCategories.map((item) => <option key={item.id} value={item.id}>{item.category_name} / {item.name}</option>)}
            </select>
            {renderFieldError('productSubCategory')}
          </div>
          <div>
            <label className="form-label">Brand</label>
            <select className={getSelectClass('productBrand')} value={productForm.brandId} onChange={(e) => {
              setProductForm((prev) => ({ ...prev, brandId: e.target.value, modelId: '' }));
              setFieldError('productBrand');
              setFieldError('productModel');
            }}>
              <option value="">Select brand</option>
              {catalog.brands.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
            {renderFieldError('productBrand')}
          </div>
          <div>
            <label className="form-label">Model</label>
            <select className={getSelectClass('productModel')} value={productForm.modelId} onChange={(e) => {
              setProductForm((prev) => ({ ...prev, modelId: e.target.value }));
              setFieldError('productModel');
            }}>
              <option value="">Select model</option>
              {filteredProductModels.map((item) => <option key={item.id} value={item.id}>{item.brand_name} / {item.name}</option>)}
            </select>
            {renderFieldError('productModel')}
          </div>
          <div className="admin-grid-span">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows="3" value={productForm.description} onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))}></textarea>
          </div>
          <div className="admin-grid-span">
            <label className="form-label">Image URL</label>
            <input className="form-control" value={productForm.image} onChange={(e) => setProductForm((prev) => ({ ...prev, image: e.target.value }))} />
          </div>
          <div className="admin-grid-span">
            <label className="form-label">{modal.mode === 'edit' ? 'Replace product image' : 'Upload product image'}</label>
            <input className="form-control" type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => setProductImageFile(e.target.files?.[0] || null)} />
          </div>
        </div>
      );
    }

    if (modal.type === 'category') {
      return (
        <div className="admin-form-grid">
          <div>
            <label className="form-label">Category name</label>
            <input className={getFieldClass('categoryName')} value={categoryForm.name} onChange={(e) => {
              setCategoryForm((prev) => ({ ...prev, name: e.target.value }));
              setFieldError('categoryName');
            }} />
            {renderFieldError('categoryName')}
          </div>
          <div>
            <label className="form-label">Description</label>
            <input className="form-control" value={categoryForm.description} onChange={(e) => setCategoryForm((prev) => ({ ...prev, description: e.target.value }))} />
          </div>
        </div>
      );
    }

    if (modal.type === 'subCategory') {
      return (
        <div className="admin-form-grid">
          <div>
            <label className="form-label">Category</label>
            <select className={getSelectClass('subCategoryCategory')} value={subCategoryForm.categoryId} onChange={(e) => {
              setSubCategoryForm((prev) => ({ ...prev, categoryId: e.target.value }));
              setFieldError('subCategoryCategory');
            }}>
              <option value="">Select category</option>
              {catalog.categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
            {renderFieldError('subCategoryCategory')}
          </div>
          <div>
            <label className="form-label">Sub-category name</label>
            <input className={getFieldClass('subCategoryName')} value={subCategoryForm.name} onChange={(e) => {
              setSubCategoryForm((prev) => ({ ...prev, name: e.target.value }));
              setFieldError('subCategoryName');
            }} />
            {renderFieldError('subCategoryName')}
          </div>
          <div className="admin-grid-span">
            <label className="form-label">Description</label>
            <input className="form-control" value={subCategoryForm.description} onChange={(e) => setSubCategoryForm((prev) => ({ ...prev, description: e.target.value }))} />
          </div>
        </div>
      );
    }

    if (modal.type === 'brand') {
      return (
        <div>
          <label className="form-label">Brand name</label>
          <input className={getFieldClass('brandName')} value={brandForm.name} onChange={(e) => {
            setBrandForm({ name: e.target.value });
            setFieldError('brandName');
          }} />
          {renderFieldError('brandName')}
        </div>
      );
    }

    if (modal.type === 'model') {
      return (
        <div className="admin-form-grid">
          <div>
            <label className="form-label">Brand</label>
            <select className={getSelectClass('modelBrand')} value={modelForm.brandId} onChange={(e) => {
              setModelForm((prev) => ({ ...prev, brandId: e.target.value }));
              setFieldError('modelBrand');
            }}>
              <option value="">Select brand</option>
              {catalog.brands.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
            {renderFieldError('modelBrand')}
          </div>
          <div>
            <label className="form-label">Model name</label>
            <input className={getFieldClass('modelName')} value={modelForm.name} onChange={(e) => {
              setModelForm((prev) => ({ ...prev, name: e.target.value }));
              setFieldError('modelName');
            }} />
            {renderFieldError('modelName')}
          </div>
        </div>
      );
    }

    if (modal.type === 'user') {
      return (
        <div className="admin-form-grid admin-form-grid-wide">
          <div>
            <label className="form-label">First name</label>
            <input className={getFieldClass('userFirstName')} value={userForm.firstName} onChange={(e) => {
              setUserForm((prev) => ({ ...prev, firstName: e.target.value }));
              setFieldError('userFirstName');
            }} />
            {renderFieldError('userFirstName')}
          </div>
          <div>
            <label className="form-label">Last name</label>
            <input className={getFieldClass('userLastName')} value={userForm.lastName} onChange={(e) => {
              setUserForm((prev) => ({ ...prev, lastName: e.target.value }));
              setFieldError('userLastName');
            }} />
            {renderFieldError('userLastName')}
          </div>
          <div>
            <label className="form-label">Email</label>
            <input className={getFieldClass('userEmail')} type="email" value={userForm.email} onChange={(e) => {
              setUserForm((prev) => ({ ...prev, email: e.target.value }));
              setFieldError('userEmail');
            }} />
            {renderFieldError('userEmail')}
          </div>
          <div>
            <label className="form-label">{modal.mode === 'edit' ? 'New password (optional)' : 'Password'}</label>
            <input className={getFieldClass('userPassword')} type="password" value={userForm.password} onChange={(e) => {
              setUserForm((prev) => ({ ...prev, password: e.target.value }));
              setFieldError('userPassword');
            }} />
            {renderFieldError('userPassword')}
          </div>
          <div>
            <label className="form-label">Phone number</label>
            <input className="form-control" value={userForm.phoneNumber} onChange={(e) => setUserForm((prev) => ({ ...prev, phoneNumber: e.target.value }))} />
          </div>
          <div>
            <label className="form-label">Role</label>
            <select className={getSelectClass('userRole')} value={userForm.role} onChange={(e) => {
              setUserForm((prev) => ({ ...prev, role: e.target.value }));
              setFieldError('userRole');
            }}>
              <option value={USER_ROLES.CUSTOMER}>{USER_ROLES.CUSTOMER}</option>
              <option value={USER_ROLES.ADMIN}>{USER_ROLES.ADMIN}</option>
            </select>
            {renderFieldError('userRole')}
          </div>
          <div className="admin-grid-span">
            <label className="form-label">Address</label>
            <input className="form-control" value={userForm.address} onChange={(e) => setUserForm((prev) => ({ ...prev, address: e.target.value }))} />
          </div>
          <div>
            <label className="form-label">City</label>
            <input className="form-control" value={userForm.city} onChange={(e) => setUserForm((prev) => ({ ...prev, city: e.target.value }))} />
          </div>
          <div>
            <label className="form-label">Country</label>
            <input className="form-control" value={userForm.country} onChange={(e) => setUserForm((prev) => ({ ...prev, country: e.target.value }))} />
          </div>
        </div>
      );
    }

    if (modal.type === 'order' && modal.item) {
      const order = modal.item;
      return (
        <div className="admin-order-modal">
          <div className="admin-detail-grid">
            <div><strong>Order ID:</strong> #{order.id}</div>
            <div><strong>Total:</strong> ${Number(order.total_amount || 0).toFixed(2)}</div>
            <div><strong>Customer:</strong> {order.customer_name}</div>
            <div><strong>Phone:</strong> {order.customer_phone_number}</div>
            <div className="admin-grid-span"><strong>Address:</strong> {order.customer_address}</div>
          </div>
          <div className="mt-3">
            <label className="form-label">Order status</label>
            <select className={getSelectClass('orderStatus')} value={orderForm.status} onChange={(e) => {
              setOrderForm({ status: e.target.value });
              setFieldError('orderStatus');
            }}>
              {ORDER_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
            {renderFieldError('orderStatus')}
          </div>
          {Array.isArray(order.items) && order.items.length > 0 && (
            <div className="mt-4">
              <h6>Items</h6>
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.product_name || item.product_id}</td>
                        <td>{item.quantity}</td>
                        <td>${Number(item.price || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (modal.type === 'delete' && modal.item) {
      return <p className="mb-0">Delete this {modal.item.entityType} permanently?</p>;
    }

    return null;
  };

  const renderModalFooter = () => {
    if (!modal.type) {
      return null;
    }

    if (modal.type === 'delete') {
      return (
        <>
          <button className="btn btn-outline-secondary" type="button" onClick={closeModal}>Cancel</button>
          <button className="btn btn-danger" type="button" disabled={saving} onClick={handleDelete}>Delete</button>
        </>
      );
    }

    if (modal.mode === 'view') {
      return (
        <button className="btn btn-outline-secondary" type="button" onClick={closeModal}>Close</button>
      );
    }

    return (
      <>
        <button className="btn btn-outline-secondary" type="button" onClick={closeModal}>Cancel</button>
        <button className="btn btn-primary" type="button" disabled={saving} onClick={handleModalSave}>
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </>
    );
  };

  if (loading) {
    return <Loading message="Loading admin workspace..." />;
  }

  const sectionMeta = {
    products: {
      title: 'Products',
      description: 'Create, update, and remove product records.',
    },
    categories: {
      title: 'Categories',
      description: 'Manage the main product categories.',
    },
    subCategories: {
      title: 'Sub-categories',
      description: 'Manage sub-categories under the main categories.',
    },
    brands: {
      title: 'Brands',
      description: 'Manage brands used across the catalog.',
    },
    models: {
      title: 'Models',
      description: 'Manage vehicle models under each brand.',
    },
    orders: {
      title: 'Orders',
      description: 'Review customer orders and update their lifecycle.',
    },
    users: {
      title: 'Users',
      description: 'Manage customer and admin accounts.',
    },
  };

  const currentSection = sectionMeta[section] || sectionMeta.products;

  return (
    <div className="admin-page">
      <div className="admin-header mb-4">
        <h1 className="h3 mb-1">{currentSection.title}</h1>
        <p className="text-muted mb-0">{currentSection.description}</p>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      {success && <div className="alert alert-success">{success}</div>}

      {section === 'products' && (
        <section className="card admin-section-card">
          <div className="card-body">
            <div className="admin-section-header">
              <div>
                <h2 className="h5 mb-1">Products</h2>
                <p className="text-muted mb-0">Create, update, and remove product records.</p>
              </div>
              <button className="btn btn-primary" onClick={() => openProductModal('create')}>Add Product</button>
            </div>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {catalog.products.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.category_name || item.sub_category_name || 'N/A'}</td>
                      <td>{item.brand_name || 'N/A'}</td>
                      <td>${Number(item.price || 0).toFixed(2)}</td>
                      <td>{item.stock_quantity}</td>
                      <td className="text-end">
                        <div className="admin-row-actions justify-content-end">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => openViewModal('product', item)}>View</button>
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => openProductModal('edit', item)}>Edit</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => openDeleteModal('product', item)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {section === 'categories' && (
        <section className="card admin-section-card">
          <div className="card-body">
            <div className="admin-section-header">
              <div>
                <h2 className="h5 mb-1">Categories</h2>
                <p className="text-muted mb-0">Create, update, and remove main product categories.</p>
              </div>
              <button className="btn btn-primary" onClick={() => openCategoryModal('category', 'create')}>Add Category</button>
            </div>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {catalog.categories.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.description || 'No description'}</td>
                      <td className="text-end">
                        <div className="admin-row-actions justify-content-end">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => openViewModal('category', item)}>View</button>
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => openCategoryModal('category', 'edit', item)}>Edit</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => openDeleteModal('category', item)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {section === 'subCategories' && (
        <section className="card admin-section-card">
          <div className="card-body">
            <div className="admin-section-header">
              <div>
                <h2 className="h5 mb-1">Sub-categories</h2>
                <p className="text-muted mb-0">Manage sub-categories that sit under your main categories.</p>
              </div>
              <button className="btn btn-primary" onClick={() => openCategoryModal('subCategory', 'create')}>Add Sub-category</button>
            </div>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {catalog.subCategories.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.category_name}</td>
                      <td>{item.description || 'No description'}</td>
                      <td className="text-end">
                        <div className="admin-row-actions justify-content-end">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => openViewModal('subCategory', item)}>View</button>
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => openCategoryModal('subCategory', 'edit', item)}>Edit</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => openDeleteModal('subCategory', item)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {section === 'brands' && (
        <section className="card admin-section-card">
          <div className="card-body">
            <div className="admin-section-header">
              <div>
                <h2 className="h5 mb-1">Brands</h2>
                <p className="text-muted mb-0">Manage product brands available in the catalog.</p>
              </div>
              <button className="btn btn-primary" onClick={() => openCategoryModal('brand', 'create')}>Add Brand</button>
            </div>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Models</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {catalog.brands.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.model_count || 0}</td>
                      <td className="text-end">
                        <div className="admin-row-actions justify-content-end">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => openViewModal('brand', item)}>View</button>
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => openCategoryModal('brand', 'edit', item)}>Edit</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => openDeleteModal('brand', item)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {section === 'models' && (
        <section className="card admin-section-card">
          <div className="card-body">
            <div className="admin-section-header">
              <div>
                <h2 className="h5 mb-1">Models</h2>
                <p className="text-muted mb-0">Manage vehicle models grouped under brands.</p>
              </div>
              <button className="btn btn-primary" onClick={() => openCategoryModal('model', 'create')}>Add Model</button>
            </div>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Brand</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {catalog.models.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.brand_name}</td>
                      <td className="text-end">
                        <div className="admin-row-actions justify-content-end">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => openViewModal('model', item)}>View</button>
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => openCategoryModal('model', 'edit', item)}>Edit</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => openDeleteModal('model', item)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {section === 'orders' && (
        <section className="card admin-section-card">
          <div className="card-body">
            <div className="admin-section-header">
              <div>
                <h2 className="h5 mb-1">Orders</h2>
                <p className="text-muted mb-0">Review customer orders and update status through a modal.</p>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {catalog.orders.map((item) => (
                    <tr key={item.id}>
                      <td>#{item.id}</td>
                      <td>{item.customer_name}</td>
                      <td>${Number(item.total_amount || 0).toFixed(2)}</td>
                      <td>{item.status}</td>
                      <td>{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}</td>
                      <td className="text-end">
                        <div className="admin-row-actions justify-content-end">
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => openOrderModal('edit', item)}>Manage</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => openDeleteModal('order', item)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {section === 'users' && (
        <section className="card admin-section-card">
          <div className="card-body">
            <div className="admin-section-header">
              <div>
                <h2 className="h5 mb-1">Users</h2>
                <p className="text-muted mb-0">Manage customer and admin accounts.</p>
              </div>
              <button className="btn btn-primary" onClick={() => openUserModal('create')}>Add User</button>
            </div>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Phone</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {catalog.users.map((item) => (
                    <tr key={item.id}>
                      <td>{item.firstName} {item.lastName}</td>
                      <td>{item.email}</td>
                      <td>{item.role}</td>
                      <td>{item.phoneNumber || 'N/A'}</td>
                      <td className="text-end">
                        <div className="admin-row-actions justify-content-end">
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => openUserModal('edit', item)}>Edit</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => openDeleteModal('user', item)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      <AdminModal
        show={Boolean(modal.type)}
        title={
          modal.type === 'delete'
            ? 'Confirm delete'
            : modal.mode === 'view'
                ? `View ${modal.type === 'subCategory' ? 'sub-category' : modal.type || ''}`
              : modal.type === 'order'
                ? 'Manage order'
                : `${modal.mode === 'edit' ? 'Edit' : 'Add'} ${modal.type === 'subCategory' ? 'sub-category' : modal.type || ''}`
        }
        onClose={closeModal}
        footer={renderModalFooter()}
      >
        {renderFormModalBody()}
      </AdminModal>
    </div>
  );
};

export default AdminDashboard;
