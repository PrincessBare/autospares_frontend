import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCreditCard, FiMapPin, FiUser } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useCartStore } from '../stores/cartStore';
import orderService from '../services/orderService';
import ErrorAlert from '../components/ErrorAlert';
import '../styles/Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const cartItems = useCartStore((state) => state.items);
  const getCartTotal = useCartStore((state) => state.getCartTotal);
  const clearCart = useCartStore((state) => state.clearCart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customerName, setCustomerName] = useState(`${user?.firstName || ''} ${user?.lastName || ''}`.trim());
  const [customerPhone, setCustomerPhone] = useState(user?.phoneNumber || '');
  const [customerAddress, setCustomerAddress] = useState(user?.address || '');

  const placeOrder = async (event) => {
    event.preventDefault();
    setError(null);

    if (!cartItems.length) {
      setError('Your cart is empty.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        customerName,
        customerPhone,
        customerAddress,
      };

      const response = await orderService.createOrder(payload);
      const order = response.data?.data;

      if (order?.id) {
        const paymentResponse = await orderService.processPayment({
          orderId: order.id,
          paymentMethod: 'paynow',
        });

        const redirectUrl = paymentResponse.data?.data?.redirectUrl;
        if (!redirectUrl) {
          throw new Error('PayNow did not return a redirect URL.');
        }

        clearCart();
        window.location.href = redirectUrl;
        return;
      }

      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <h1 className="h3 mb-4">Checkout</h1>
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <form onSubmit={placeOrder}>
                <div className="mb-3">
                  <label className="form-label"><FiUser className="me-2" />Customer Name</label>
                  <input className="form-control" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input className="form-control" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required />
                </div>
                <div className="mb-4">
                  <label className="form-label"><FiMapPin className="me-2" />Delivery Address</label>
                  <textarea className="form-control" rows="3" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} required />
                </div>
                <button className="btn btn-success" type="submit" disabled={loading}>
                  <FiCreditCard className="me-2" />
                  {loading ? 'Redirecting to PayNow...' : 'Pay with PayNow'}
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card checkout-sticky sticky-top" style={{ top: '1rem' }}>
            <div className="card-body">
              <h2 className="h5">Order Summary</h2>
              {cartItems.map((item) => (
                <p key={item.id} className="d-flex justify-content-between mb-2">
                  <span>{item.name} x{item.quantity}</span>
                  <strong>${Number((item.price || 0) * item.quantity).toFixed(2)}</strong>
                </p>
              ))}
              <hr />
              <p className="d-flex justify-content-between">
                <span>Total</span>
                <strong>${getCartTotal().toFixed(2)}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
