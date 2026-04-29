import React from 'react';
import { Navigate } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiMinus, FiPlus, FiShoppingBag, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { USER_ROLES } from '../config/constants';
import { useCartStore } from '../stores/cartStore';
import { resolveAssetUrl } from '../utils/assetUrl';
import '../styles/Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const getCartTotal = useCartStore((state) => state.getCartTotal);

  const tax = getCartTotal() * 0.15;
  const shipping = items.length > 0 ? 10 : 0;
  const grandTotal = getCartTotal() + tax + shipping;

  if (user?.role === USER_ROLES.ADMIN) {
    return <Navigate to="/admin/products" replace />;
  }

  if (!items.length) {
    return (
      <div className="container my-5 text-center">
        <h1 className="h4">Your cart is empty</h1>
        <Link className="btn btn-primary mt-3" to="/products"><FiShoppingBag className="me-2" />Browse products</Link>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Shopping Cart</h1>
        <span className="text-muted">{items.length} item(s)</span>
      </div>
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card p-3 p-md-4">
            <div className="cart-items-list">
              {items.map((item) => (
                <article className="cart-item" key={item.id}>
                  <div className="cart-item-image-wrap">
                    <img
                      src={resolveAssetUrl(item.img || item.image)}
                      alt={item.name}
                      className="cart-item-image"
                    />
                  </div>
                  <div className="cart-item-content">
                    <h2 className="cart-item-name">{item.name}</h2>
                    <p className="cart-item-price">${Number(item.price || 0).toFixed(2)}</p>
                    <div className="cart-item-actions">
                      <div className="qty-control">
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <FiMinus />
                        </button>
                        <span>{item.quantity}</span>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <FiPlus />
                        </button>
                      </div>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(item.id)}>
                        <FiTrash2 className="me-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-total">
                    ${Number((item.price || 0) * item.quantity).toFixed(2)}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card cart-summary-card">
            <div className="card-body">
              <h2 className="h5 mb-3">Summary</h2>
              <p className="d-flex justify-content-between"><span>Subtotal</span><strong>${getCartTotal().toFixed(2)}</strong></p>
              <p className="d-flex justify-content-between"><span>Tax</span><strong>${tax.toFixed(2)}</strong></p>
              <p className="d-flex justify-content-between"><span>Shipping</span><strong>${shipping.toFixed(2)}</strong></p>
              <hr />
              <p className="d-flex justify-content-between"><span>Total</span><strong>${grandTotal.toFixed(2)}</strong></p>
              <button className="btn btn-primary w-100 mb-2" onClick={() => navigate('/checkout')}>Proceed to checkout <FiArrowRight className="ms-2" /></button>
              <button className="btn btn-outline-danger w-100" onClick={clearCart}>Clear cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
