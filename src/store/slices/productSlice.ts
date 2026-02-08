import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { productService } from '../../api/productService';

interface ProductState {
    products: any[];
    categories: any[];
    loading: boolean;
    error: string | null;
}

const initialState: ProductState = {
    products: [],
    categories: [],
    loading: false,
    error: null,
};

export const fetchProducts = createAsyncThunk('product/fetchProducts', async (limit: number = 30) => {
    return await productService.getAllProducts(0, limit);
});

export const fetchCategories = createAsyncThunk('product/fetchCategories', async () => {
    return await productService.getAllCategories();
});

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'An unexpected error occurred while fetching products';
            })
            .addCase(fetchCategories.pending, (state) => {
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to load categories';
            });
    },
});

export const { clearError } = productSlice.actions;
export default productSlice.reducer;
