import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * Route Guard for Citizen portal paths.
 * Prevents unverified visitors from accessing home, reporting,
 * profile, messages, or submissions without completing Aadhaar onboarding.
 */
export const CitizenRouteGuard = ({ children }) => {
  const isOnboarded = localStorage.getItem('setu_onboarded') === 'true';
  const hasUserData = Boolean(
    localStorage.getItem('setu_user') || localStorage.getItem('sih_user_data')
  );

  if (!isOnboarded || !hasUserData) {
    return <Navigate to="/onboarding" replace />;
  }

  return children ? children : <Outlet />;
};
