"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Typography, Container, Box, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store/store';
import { loginUser } from '../redux/features/user-slice';

const LoginPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const { status, error, isLoggedIn, user } = useSelector((state: RootState) => state.user);
    const isLoading = status === 'loading';
    const emailInputRef = useRef<HTMLInputElement>(null);
    
    // Redirect if already logged in
    useEffect(() => {
        if (isLoggedIn && user) {
            redirectBasedOnRole(user.role);
        }
    }, [isLoggedIn, user]);

    // Focus on email input when component mounts
    useEffect(() => {
        if (emailInputRef.current) {
            emailInputRef.current.focus();
        }
    }, []);

    // Handle focus event on email input
    const handleEmailFocus = () => {
        // If user is already logged in, redirect based on role
        if (isLoggedIn && user) {
            redirectBasedOnRole(user.role);
        }
    };

    // Centralized function for role-based redirection
    const redirectBasedOnRole = (role: string) => {
        if (role === 'admin') {
            router.push('/');
        } else if (role === 'manager') {
            router.push('/products');
        } else {
            router.push('/');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }))
          .unwrap()
          .then((result) => {
            // Role-based redirection after successful login
            redirectBasedOnRole(result.user.role);
            router.refresh();
          })
          .catch((error) => {
            console.error('Login failed:', error);
          });
    };

return (
<Container maxWidth="sm">
<Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

<Typography variant="h5" component="h1" gutterBottom>
  Login
</Typography>

{error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

<Alert severity="info" sx={{ width: '100%', mb: 2 }}>
  <Typography variant="body2">
    <strong>Admin Credentials:</strong> admin@mail.com / admin123
  </Typography>
  <Typography variant="body2">
    <strong>Customer Credentials:</strong> john@mail.com / changeme
  </Typography>
</Alert>

<form onSubmit={handleSubmit} style={{ width: '100%' }}>

<TextField
  label="Email"
  fullWidth
  margin="normal"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  onFocus={handleEmailFocus}
  inputRef={emailInputRef}
  placeholder="Enter your email"
  required
/>

<TextField
  label="Password"
  fullWidth
  margin="normal"
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="Enter your password"
  required
/>

<Button
  type="submit"
  fullWidth
  variant="contained"
  sx={{ mt: 3, mb: 2 }}
  disabled={isLoading}
>
  {isLoading ? 'Logging in...' : 'Login'}
</Button>
</form>
</Box>
</Container>
);
};

export default LoginPage;