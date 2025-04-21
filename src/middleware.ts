import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes and their allowed roles
const protectedRoutes = {
  '/products': ['admin', 'manager'],
  '/categories': ['admin'],
};

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Check if the path is a protected route
  const isProtectedRoute = Object.keys(protectedRoutes).some(route => 
    path.startsWith(route)
  );
  
  if (isProtectedRoute) {
    // Get the token and user role from cookies
    const token = request.cookies.get('accessToken')?.value;
    const userRole = request.cookies.get('userRole')?.value;
    
    // If no token, redirect to login
    if (!token) {
      console.log('No token found, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Check if the user has the required role for this route
    const allowedRoles = Object.entries(protectedRoutes).find(([route]) => 
      path.startsWith(route)
    )?.[1] || [];
    
    // If user role is not in the allowed roles, redirect to dashboard
    if (userRole && !allowedRoles.includes(userRole)) {
      console.log(`User role ${userRole} not allowed for ${path}, redirecting to dashboard`);
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}

// Configure which routes to run the middleware on
export const config = {
  matcher: [
    '/products/:path*',
    '/categories/:path*',
  ],
}; 