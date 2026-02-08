import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList, AuthStackParamList } from './types';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { Colors } from '../constants/colors';
import Toast from 'react-native-toast-message';
import RNBootSplash from 'react-native-bootsplash';
import WelcomeScreen from '../screens/Auth/WelcomeScreen';
import LoginScreen from '../screens/Auth/loginScreen';
import SignupScreen from '../screens/Auth/signupScreen';
import auth from '@react-native-firebase/auth';
import { setCredentials, logout } from '../store/slices/authSlice';
import CommonButton from '../components/CommonButton';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
    return (
        <AuthStack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: Colors.background },
            }}>
            <AuthStack.Screen name="WelcomeScreen" component={WelcomeScreen} />
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="Signup" component={SignupScreen} />
        </AuthStack.Navigator>
    );
};

const AppNavigator: React.FC = () => {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

    React.useEffect(() => {
        const subscriber = auth().onAuthStateChanged((user) => {
            if (user) {
                dispatch(setCredentials({
                    user: {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                    },
                    token: 'firebase-token'
                }));
            } else {
                dispatch(logout());
            }
            RNBootSplash.hide({ fade: true });
        });
        return subscriber;
    }, [dispatch]);

    return (
        <View style={{ flex: 1 }}>
            {isAuthenticated ? (
                <View style={styles.authenticatedContainer}>
                    <Text style={styles.welcomeText}>Welcome to PSquare!</Text>
                    <CommonButton
                        title="Logout"
                        onPress={() => auth().signOut()}
                        style={styles.logoutBtn}
                    />
                </View>
            ) : (
                <AuthNavigator />
            )}
            <Toast />
        </View>
    );
};

const styles = StyleSheet.create({
    authenticatedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
    welcomeText: {
        color: Colors.white,
        fontSize: 20,
        marginBottom: 20,
    },
    logoutBtn: {
        width: 200,
    }
});

export default AppNavigator;
