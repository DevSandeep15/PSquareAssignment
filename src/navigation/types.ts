import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { NavigatorScreenParams } from '@react-navigation/native';

// Define the param list for auth stack
export type AuthStackParamList = {
    WelcomeScreen: undefined;
    Login: undefined;
    Signup: undefined;
};

// Define the param list for stack navigation
export type RootStackParamList = {
    Auth: NavigatorScreenParams<AuthStackParamList>;
    Main: undefined; // Placeholder for main app later
};

export type WelcomeScreenProps = NativeStackScreenProps<AuthStackParamList, 'WelcomeScreen'>;

// Declare global types for navigation
declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}

