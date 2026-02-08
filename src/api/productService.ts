import axios from 'axios';
import { ENDPOINTS } from '../constants/urls';

export const productService = {
    getAllProducts: async (offset = 0, limit = 10) => {
        try {
            const response = await axios.get(`${ENDPOINTS.PRODUCTS}?offset=${offset}&limit=${limit}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch products');
        }
    },
    getSingleProduct: async (id: number) => {
        try {
            const response = await axios.get(`${ENDPOINTS.PRODUCTS}/${id}`);
            console.log("Single Product=====>", response.data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch product details');
        }
    },
    getAllCategories: async () => {
        try {
            const response = await axios.get(ENDPOINTS.CATEGORIES);

            console.log("response", response.data);

            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch categories');
        }
    },
    getProductsByCategory: async (categoryId: number) => {
        try {
            const response = await axios.get(`${ENDPOINTS.PRODUCTS}/?categoryId=${categoryId}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch products for this category');
        }
    },
};
