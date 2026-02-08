import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderItem {
    id: number;
    title: string;
    price: number;
    image: string;
    quantity: number;
    size?: string;
    color?: string;
}

interface Order {
    id: string;
    items: OrderItem[];
    shippingAddress: {
        firstName: string;
        lastName: string;
        country: string;
        street: string;
        city: string;
        state: string;
        zipCode: string;
        phone: string;
    };
    shippingMethod: {
        id: string;
        name: string;
        price: number;
        deliveryTime: string;
    };
    total: number;
    date: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered';
}

interface OrderState {
    orders: Order[];
}

const initialState: OrderState = {
    orders: [],
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        createOrder: (state, action: PayloadAction<Omit<Order, 'id' | 'date' | 'status'>>) => {
            const newOrder: Order = {
                ...action.payload,
                id: Math.random().toString(36).substr(2, 9),
                date: new Date().toISOString(),
                status: 'pending',
            };
            state.orders.push(newOrder);
        },
    },
});

export const { createOrder } = orderSlice.actions;
export default orderSlice.reducer;
