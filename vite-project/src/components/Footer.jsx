import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { USER_ROLES } from '../config/constants';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { user } = useAuth();
  const isAdmin = user?.role === USER_ROLES.ADMIN;

  return (
    <footer className="footer-modern mt-5 py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold mb-3">AutoSpares</h5>
            <p className="footer-text">
              Quality auto parts in one place.
            </p>
            <ul className="list-unstyled mt-3 footer-text">
              <li className="mb-2"><FiMail className="me-2" />support@autospares.com</li>
              <li className="mb-2"><FiPhone className="me-2" />+263 77 000 0000</li>
              <li><FiMapPin className="me-2" />Harare, Zimbabwe</li>
            </ul>
          </div>
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className="footer-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="footer-link">
                  Products
                </Link>
              </li>
              {isAdmin ? (
                <li>
                  <Link to="/admin/products" className="footer-link">Admin Panel</Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link to="/cart" className="footer-link">Cart</Link>
                  </li>
                  <li>
                    <Link to="/orders" className="footer-link">My Orders</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold mb-3">Support</h5>
            <ul className="list-unstyled">
              <li><span className="footer-text">{isAdmin ? 'Catalog' : 'Orders'}</span></li>
              <li><span className="footer-text">{isAdmin ? 'Inventory' : 'Tracking'}</span></li>
              <li><span className="footer-text">Customer support</span></li>
            </ul>
          </div>
        </div>
        <div className="border-top pt-4 mt-4">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="footer-text small mb-0">
                © {currentYear} AutoSpares. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="footer-text small mb-0">Auto parts store</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
