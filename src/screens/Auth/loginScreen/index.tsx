import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import CommonHeader from '../../../components/CommonHeader';
import CommonTextField from '../../../components/CommonTextField';
import CommonButton from '../../../components/CommonButton';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';

import { getFirebaseErrorMessage } from '../../../utils/helpers';

const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
});

const LoginScreen = () => {
    const navigation = useNavigation<any>();
    const [loading, setLoading] = useState(false);

    const handleLogin = async (values: any) => {
        setLoading(true);
        try {
            await auth().signInWithEmailAndPassword(values.email, values.password);
            Toast.show({
                type: 'success',
                text1: 'Login Successful',
                text2: 'Welcome back!',
            });
            // Navigation will be handled by AppNavigator's isAuthenticated listener
        } catch (error: any) {
            const friendlyMessage = getFirebaseErrorMessage(error);
            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: friendlyMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior="padding"
                style={{ flex: 1 }}>
                <CommonHeader title="Log into" subtitle="your account" />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}>

                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={LoginSchema}
                        onSubmit={handleLogin}>
                        {({
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            values,
                            errors,
                            touched,
                        }) => (
                            <View style={styles.form}>
                                <CommonTextField
                                    placeholder="Enter your email"
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                    error={errors.email}
                                    touched={touched.email}
                                    keyboardType="email-address"
                                />

                                <CommonTextField
                                    placeholder="Enter your password"
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values.password}
                                    error={errors.password}
                                    touched={touched.password}
                                    isPassword
                                />

                                <TouchableOpacity style={styles.forgotPassword}>
                                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                                </TouchableOpacity>

                                <View style={styles.buttonContainer}>
                                    <CommonButton
                                        title="SIGN IN"
                                        onPress={handleSubmit}
                                        loading={loading}
                                        style={styles.loginBtn}
                                    />
                                </View>
                            </View>
                        )}
                    </Formik>
                </ScrollView>


            </KeyboardAvoidingView>
            <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                    <Text style={styles.linkText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingHorizontal: moderateScale(20),
    },
    scrollContent: {
        flexGrow: 1,
    },
    form: {
        flex: 1,
        marginTop: verticalScale(20),
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: verticalScale(30),
    },
    forgotPasswordText: {
        color: Colors.textSecondary,
        fontSize: moderateScale(12),
        fontFamily: Theme.fontFamily.medium,
    },
    buttonContainer: {
        alignItems: 'center',
        marginBottom: verticalScale(40),
    },
    loginBtn: {
        width: moderateScale(150), // Smaller as per image
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(20),
    },
    footerText: {
        color: Colors.white,
        fontSize: moderateScale(14),
        fontFamily: Theme.fontFamily.regular,
    },
    linkText: {
        color: Colors.white,
        fontSize: moderateScale(14),
        fontFamily: Theme.fontFamily.bold,
        textDecorationLine: 'underline',
    },
});

export default LoginScreen;
