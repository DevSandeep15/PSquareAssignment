import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, Image } from 'react-native';
import { IMAGES } from '../constants/images';
import HomeScreen from '../screens/Main/home';
import SearchScreen from '../screens/Main/discover';
import BagScreen from '../screens/Main/cart';
import ProfileScreen from '../screens/Main/profile';
import ProductDetailScreen from '../screens/Main/ProductDetail';
import ProductListScreen from '../screens/Main/ProductList';
import ShippingScreen from '../screens/Main/Checkout/ShippingScreen';
import PaymentScreen from '../screens/Main/Checkout/PaymentScreen';
import OrderSuccessScreen from '../screens/Main/Checkout/OrderSuccessScreen';
import { Colors } from '../constants/colors';
import { moderateScale } from 'react-native-size-matters';
import type { MainStackParamList, MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<MainStackParamList>();

const TabIcon = ({ name, color, size }: { name: string; color: string; size: number }) => {
    let icon;
    switch (name) {
        case 'Home':
            icon = IMAGES.homeIcon;
            break;
        case 'Search':
            icon = IMAGES.searchIcon;
            break;
        case 'Bag':
            icon = IMAGES.cartIcon;
            break;
        case 'Profile':
            icon = IMAGES.profileIcon;
            break;
        default:
            return null;
    }

    return (
        <Image
            source={icon}
            style={{
                width: moderateScale(22),
                height: moderateScale(22),
                tintColor: color
            }}
            resizeMode="contain"
        />
    );
};

const MainTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    return <TabIcon name={route.name} color={color} size={size} />;
                },
                tabBarActiveTintColor: Colors.white,
                tabBarInactiveTintColor: Colors.tabBarInactive,
                tabBarStyle: styles.tabBar,
                tabBarShowLabel: false,
                sceneContainerStyle: { backgroundColor: Colors.backgroundgray },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Search" component={SearchScreen} />
            <Tab.Screen name="Bag" component={BagScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

const MainNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: Colors.backgroundgray }
            }}
        >
            <Stack.Screen name="Tabs" component={MainTabs} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
            <Stack.Screen name="ProductList" component={ProductListScreen} />
            <Stack.Screen name="Shipping" component={ShippingScreen} />
            <Stack.Screen name="Payment" component={PaymentScreen} />
            <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: Colors.background,
        borderTopWidth: 0,
        height: moderateScale(65),
        paddingBottom: moderateScale(10),
        paddingTop: moderateScale(10),
        borderTopEndRadius: moderateScale(20),
        borderTopStartRadius: moderateScale(20),
        elevation: 0,
        shadowOpacity: 0,
    },
});

export default MainNavigator;
