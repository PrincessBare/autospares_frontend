import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

const ErrorAlert = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="alert alert-danger alert-dismissible fade show" role="alert">
      <strong><FiAlertCircle className="me-2 mb-1" />Error:</strong> {message}
      {onClose && (
        <button type="button" className="btn-close" onClick={onClose}></button>
      )}
    </div>
  );
};

export default ErrorAlert;
