'use client';

import ClientContent from '../ClientContent';

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

import AppThemeProvider from "../common/AppThemeProvider";

import {useRouter} from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store/store';
import { logoutUser, setUser, setAccessToken } from '../../redux/features/user-slice';
import { useEffect } from 'react';
import { UserService } from '../../services/user-service';

export default function RootLayoutClient({ children }:{
  children: React.ReactNode;
}){
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isLoggedIn, user, status } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && !isLoggedIn) {
      dispatch(setAccessToken(token));
  
      const fetchUserData = async () => {
        try {
          // Fetch user profile using the token
          const user = await UserService.getUserProfile(token);
          dispatch(setUser(user));
          
          // Set cookies for server-side access
          document.cookie = `accessToken=${token}; path=/`;
          document.cookie = `userRole=${user.role}; path=/`;
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Handle error (e.g., clear token, show error message)
          localStorage.removeItem('accessToken');
          localStorage.removeItem('userRole');
        }
      };

      fetchUserData();
    }
  }, [isLoggedIn, dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push('/login');
    router.refresh();
  };

  return (
    <AppRouterCacheProvider>
      <AppThemeProvider>
        <ClientContent isLoggedIn={isLoggedIn} userRole={user?.role || null} handleLogout={handleLogout}>
          {children}
        </ClientContent>
      </AppThemeProvider>
    </AppRouterCacheProvider>
  );
}