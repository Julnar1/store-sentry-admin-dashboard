import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Product, ProductService } from '../../services/product-service';

interface ProductsState {
  products: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

const initialState: ProductsState = {
  products: [],
  status: 'idle',
  error: null,
  pagination: {
    limit: 0,
    offset: 0,
    total: 0
  }
};

const fetchProducts = createAsyncThunk(
  'products/fetchProducts', 
  async ({ limit = 0, offset = 0 }: { limit?: number, offset?: number } = {}) => {
    const response = await ProductService.getProducts(limit, offset);
    return {
      products: response,
      pagination: {
        limit,
        offset,
        total: response.length // This is a simplification, ideally the API would return total count
      }
    };
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action) => {
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
    },
    clearProducts: (state) => {
      state.products = [];
      state.pagination.offset = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export const { addProduct, updateProduct, deleteProduct, clearProducts } = productsSlice.actions;
export default productsSlice.reducer;
export { fetchProducts };