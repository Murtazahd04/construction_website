// File: src/components/common/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ allowedRoles }) => {
  const { token, role } = useSelector((state) => state.auth);

  // 1. Check if user is logged in (No token = Not logged in)
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Check if user has the correct role (if roles are specified)
  // For example, if allowedRoles=['Owner'] and your role is 'Contractor', you get blocked.
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Optional: You could redirect to an 'Unauthorized' page instead
    return <Navigate to="/" replace />; 
  }

  // 3. If checks pass, render the requested page (The "Outlet")
  return <Outlet />;
};

export default PrivateRoute;