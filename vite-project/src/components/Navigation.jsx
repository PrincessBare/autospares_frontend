import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCartStore } from '../stores/cartStore';
import { FiShoppingCart, FiUser, FiLogOut } from 'react-icons/fi';
import { HiOutlineWrenchScrewdriver } from 'react-icons/hi2';
import { USER_ROLES } from '../config/constants';
import '../styles/Navigation.css';

const Navigation = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const isAdmin = user?.role === USER_ROLES.ADMIN;
  const cartCount = useCartStore((state) => state.getCartCount());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm modern-navbar">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <HiOutlineWrenchScrewdriver className="me-2 mb-1" />
          AutoSpares
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {isAdmin ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/products">
                    Products
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/categories">
                    Categories
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/orders">
                    Orders
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/users">
                    Users
                  </NavLink>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="othersDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    Others
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="othersDropdown">
                    <li><NavLink className="dropdown-item" to="/admin/brands">Brands</NavLink></li>
                    <li><NavLink className="dropdown-item" to="/admin/models">Models</NavLink></li>
                    <li><NavLink className="dropdown-item" to="/admin/sub-categories">Sub-categories</NavLink></li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/products">
                    Products
                  </Link>
                </li>
              </>
            )}

            {!isAdmin && (
              <li className="nav-item">
                <Link className="nav-link position-relative" to="/cart">
                  <FiShoppingCart className="me-1 mb-1" />
                  Cart
                  {cartCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </li>
            )}

            {isAuthenticated ? (
              <>
                {!isAdmin && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/orders">
                      My Orders
                    </Link>
                  </li>
                )}
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="userDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    <FiUser className="me-1 mb-1" />
                    {user?.firstName || 'User'}
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="userDropdown">
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={handleLogout}
                      >
                        <FiLogOut className="me-2" />
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link btn btn-primary text-white ms-2 px-3" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
