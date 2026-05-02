import React from 'react';
import { FiLoader } from 'react-icons/fi';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
      <div className="text-center">
        <FiLoader className="text-primary mb-3 spin-loader" size={28} />
        <p className="text-muted">{message}</p>
      </div>
    </div>
  );
};

export default Loading;
