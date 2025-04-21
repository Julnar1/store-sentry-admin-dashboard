import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Category, CategoryService } from '../../services/category-service';

interface CategoriesState {
  categories: Category[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CategoriesState = {
  categories:[],
  status: 'idle',
  error: null,
};

const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
  const data = await CategoryService.getCategories();
  return data;
});

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
      addCategory: (state, action) => {
        state.categories.push(action.payload);
      },
      updateCategory: (state, action) => {
        const index = state.categories.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      },
      deleteCategory: (state, action) => {
        state.categories = state.categories.filter((c) => c.id !== action.payload);
      },
  
  }, // Add other reducers if needed (e.g., addCategory, updateCategory)
  extraReducers(builder) {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});
export const { addCategory, updateCategory, deleteCategory } = categoriesSlice.actions;
export { fetchCategories };
export default categoriesSlice.reducer;