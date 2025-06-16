//src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="text-center py-5">
      <h1 className="display-1 fw-bold text-primary mb-4">404</h1>
      <p className="h4 mb-4">Page not found</p>
      <Link 
        to="/" 
        className="btn btn-primary btn-lg"
      >
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;
