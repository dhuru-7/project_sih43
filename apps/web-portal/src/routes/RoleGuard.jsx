import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RoleGuard = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user || (!allowedRoles.includes(user.role) && user.role !== 'ADMIN')) {
    // Redirect to their assigned portal or root
    const portalUrl = user?.role === 'GOVERNMENT' ? '/government/dashboard' :
                      user?.role === 'UNIVERSITY' ? '/university/dashboard' :
                      user?.role === 'INDUSTRY' ? '/industry/dashboard' : '/';
    return <Navigate to={portalUrl} replace />;
  }

  return <Outlet />;
};
