"use client";
import React from 'react';
import { useAppSelector } from '../redux/store/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

interface RoleBasedAccessProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
  showAccessDenied?: boolean;
}

/**
 * RoleBasedAccess component
 * 
 * This component provides role-based access control for routes and UI elements.
 * It checks if the current user has the required role to access the content.
 * 
 * @param children - The content to render if the user has the required role
 * @param allowedRoles - Array of roles that are allowed to access the content
 * @param redirectTo - Optional path to redirect to if the user doesn't have the required role
 * @param showAccessDenied - Whether to show an access denied message instead of redirecting
 */
export const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({
  children,
  allowedRoles,
  redirectTo = '/',
  showAccessDenied = false
}) => {
  const { isLoggedIn, user, status } = useAppSelector((state) => state.user);
  const router = useRouter();
  
  // Check if the user has the required role
  const hasRequiredRole = isLoggedIn && user && allowedRoles.includes(user.role);
  
  useEffect(() => {
    // If not logged in or doesn't have the required role, redirect
    if (status !== 'loading' && !hasRequiredRole && !showAccessDenied) {
      router.push(redirectTo);
    }
  }, [hasRequiredRole, redirectTo, router, status, showAccessDenied]);
  
  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // If user doesn't have the required role and we're showing access denied
  if (!hasRequiredRole && showAccessDenied) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        textAlign: 'center',
        p: 3
      }}>
        <LockIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You don't have permission to access this page.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Required roles: {allowedRoles.join(', ')}
        </Typography>
      </Box>
    );
  }
  
  // If user has the required role, render the children
  return hasRequiredRole ? <>{children}</> : null;
};

/**
 * Higher-order component for role-based protection
 * 
 * @param WrappedComponent - The component to protect
 * @param allowedRoles - Array of roles that are allowed to access the component
 * @param redirectTo - Optional path to redirect to if the user doesn't have the required role
 */
export const withRoleProtection = (
  WrappedComponent: React.ComponentType<any>,
  allowedRoles: string[],
  redirectTo?: string
) => {
  return (props: any) => (
    <RoleBasedAccess allowedRoles={allowedRoles} redirectTo={redirectTo}>
      <WrappedComponent {...props} />
    </RoleBasedAccess>
  );
}; 