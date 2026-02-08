import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { NavigatorScreenParams } from '@react-navigation/native';

// Define the param list for auth stack
export type AuthStackParamList = {
    WelcomeScreen: undefined;
    Login: undefined;
    Signup: undefined;
};

// Define the param list for main tabs
export type MainTabParamList = {
    Home: undefined;
    Search: undefined;
    Bag: undefined;
    Profile: undefined;
};

// Define the param list for main stack
export type MainStackParamList = {
    Tabs: NavigatorScreenParams<MainTabParamList>;
    ProductDetail: { productId: number };
    ProductList: undefined;
    Shipping: undefined;
    OrderSuccess: undefined;
    Payment: {
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
    };
};

// Define the param list for root navigation
export type RootStackParamList = {
    Auth: NavigatorScreenParams<AuthStackParamList>;
    Main: NavigatorScreenParams<MainStackParamList>;
};

export type WelcomeScreenProps = NativeStackScreenProps<AuthStackParamList, 'WelcomeScreen'>;
export type ProductDetailProps = NativeStackScreenProps<MainStackParamList, 'ProductDetail'>;

// Declare global types for navigation
declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}
