// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import {useAuth} from '../components/AuthContext';
type Props = {
  children: React.ReactNode;
  roles: ('admin' | 'provider' | 'user')[];
};

const ProtectedRoute = ({ children, roles }: Props) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (!roles.includes(user.role)) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
// This component checks if the user is authenticated and has the required role.
// If not, it redirects to the login page or an unauthorized page.