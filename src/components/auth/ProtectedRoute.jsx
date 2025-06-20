
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const professorUserToken = localStorage.getItem('professorUserToken');

  if (!professorUserToken) {
    return <Navigate to="/professor/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
  