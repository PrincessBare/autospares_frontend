import React, { useEffect, useState } from 'react';
import { FiPackage } from 'react-icons/fi';
import Loading from '../components/Loading';
import ErrorAlert from '../components/ErrorAlert';
import orderService from '../services/orderService';
import '../styles/Orders.css';

const formatDate = (value) => {
  if (!value) return 'N/A';
  return new Date(value).toLocaleDateString();
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderService.getAllOrders();
        setOrders(response.data?.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Loading message="Loading orders..." />;

  return (
    <div className="container my-5">
      <h1 className="h3 mb-4">My Orders</h1>
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      {!orders.length ? (
        <div className="orders-empty text-center">
          <FiPackage className="mb-2 text-primary" size={24} />
          <p className="text-muted mb-0">You do not have any orders yet.</p>
        </div>
      ) : (
        <div className="row g-3">
          {orders.map((order) => (
            <div className="col-md-6" key={order.id}>
              <div className="card h-100">
                <div className="card-body">
                  <p className="mb-1"><strong>Order #{order.id}</strong></p>
                  <p className="mb-1 text-muted">Date: {formatDate(order.created_at || order.createdAt)}</p>
                  <p className="mb-1">Status: <span className="badge bg-secondary">{order.status || 'Pending'}</span></p>
                  <p className="mb-0">Total: <strong>${Number(order.total_amount || order.totalAmount || 0).toFixed(2)}</strong></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
