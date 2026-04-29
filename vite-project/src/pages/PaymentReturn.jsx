import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ErrorAlert from '../components/ErrorAlert';
import Loading from '../components/Loading';
import orderService from '../services/orderService';

const PaymentReturn = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    const fetchStatus = async () => {
      if (!orderId) {
        setError('Order ID is missing from the PayNow return URL.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await orderService.getPaymentStatus(orderId, true);
        setPaymentData(response.data?.data || null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load payment status.');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [orderId]);

  if (loading) {
    return <Loading message="Checking PayNow payment status..." />;
  }

  const payment = paymentData?.payment;
  const status = payment?.payment_status || 'Pending';

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h1 className="h4 mb-2">PayNow Payment Status</h1>
              <p className="text-muted mb-4">Order #{orderId || 'N/A'}</p>
              {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
              {!error && (
                <>
                  <div className={`alert ${status === 'Completed' ? 'alert-success' : status === 'Failed' ? 'alert-danger' : 'alert-warning'}`}>
                    Payment status: <strong>{status}</strong>
                  </div>
                  <div className="mb-4">
                    <p className="mb-2"><strong>Gateway:</strong> {paymentData?.gateway || 'PayNow'}</p>
                    <p className="mb-2"><strong>Payment method:</strong> {payment?.payment_method || 'PayNow'}</p>
                    <p className="mb-2"><strong>Merchant reference:</strong> {payment?.merchant_reference || 'Pending'}</p>
                    <p className="mb-0"><strong>PayNow reference:</strong> {payment?.paynow_reference || 'Pending'}</p>
                  </div>
                </>
              )}
              <div className="d-flex gap-2 flex-wrap">
                <Link to="/orders" className="btn btn-primary">View My Orders</Link>
                <Link to="/products" className="btn btn-outline-secondary">Back to Products</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentReturn;
