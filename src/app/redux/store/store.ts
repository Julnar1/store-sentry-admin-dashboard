import { configureStore } from '@reduxjs/toolkit';
// Import your reducers here only after creating slice files
import categoriesReducer from '../features/categories-slice'; 
import productsReducer from '../features/products-slice';
import userReducer from '../features/user-slice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    // Add your reducers here only after creating slice files
    categories: categoriesReducer,
    products: productsReducer,
    user: userReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;