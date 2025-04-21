import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthService, LoginResponse } from '../../services/auth-service';
import { UserService, User } from '../../services/user-service';

// Define the LoginCredentials interface
export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  interface UserState {
    user: User | null;
    accessToken: string | null;
    isLoggedIn: boolean;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: UserState = {
    user: null,
    accessToken: null,
    isLoggedIn: false,
    status: 'idle',
    error: null,
};
 const loginUser = createAsyncThunk(
    'user/loginUser',
    async (credentials: LoginCredentials, thunkAPI) => {
        try {
          const loginData: LoginResponse = await AuthService.login(credentials.email, credentials.password);
          return {
            user: loginData.user,
            accessToken: loginData.access_token
          };
        } catch (error: any) {
          return thunkAPI.rejectWithValue(error.message || 'Login failed');
        }
      }
    );

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logoutUser: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isLoggedIn = false;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userRole');
            
            // Remove cookies
            document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isLoggedIn = true;
        },
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload; // Add setAccessToken reducer
        },
        // setRefreshToken: (state, action: PayloadAction<string>) => {
        //     state.refreshToken = action.payload; // Add setRefreshToken reducer
        // },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                console.log('Login pending');
                state.status = 'loading';
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                console.log('Login fulfilled', action.payload); // Log the payload
                state.status = 'succeeded';
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.isLoggedIn = true;
                localStorage.setItem('accessToken', action.payload.accessToken);
                localStorage.setItem('userRole', action.payload.user.role);
                
                // Set cookies for server-side access with proper attributes
                const cookieOptions = 'path=/; max-age=86400; SameSite=Lax';
                document.cookie = `accessToken=${action.payload.accessToken}; ${cookieOptions}`;
                document.cookie = `userRole=${action.payload.user.role}; ${cookieOptions}`;
            })
            .addCase(loginUser.rejected, (state, action) => {
                console.log('Login rejected', action.error); // Log the error
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { logoutUser, setUser, setAccessToken } = userSlice.actions;
export {loginUser};
export default userSlice.reducer;