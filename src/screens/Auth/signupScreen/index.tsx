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

const SignupSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
});

const SignupScreen = () => {
    const navigation = useNavigation<any>();
    const [loading, setLoading] = useState(false);

    const handleSignup = async (values: any) => {
        setLoading(true);
        try {
            const userCredential = await auth().createUserWithEmailAndPassword(
                values.email,
                values.password
            );

            // Optionally update profile with name
            await userCredential.user.updateProfile({
                displayName: values.name,
            });

            Toast.show({
                type: 'success',
                text1: 'Account Created',
                text2: 'Welcome to PSquare!',
            });
            // Navigation will be handled by AppNavigator's isAuthenticated listener
        } catch (error: any) {
            const friendlyMessage = getFirebaseErrorMessage(error);
            Toast.show({
                type: 'error',
                text1: 'Signup Failed',
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
                <CommonHeader title="Create" subtitle="your account" />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}>

                    <Formik
                        initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
                        validationSchema={SignupSchema}
                        onSubmit={handleSignup}>
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
                                    label="Enter your name"
                                    placeholder="Enter your name"
                                    onChangeText={handleChange('name')}
                                    onBlur={handleBlur('name')}
                                    value={values.name}
                                    error={errors.name}
                                    touched={touched.name}
                                />

                                <CommonTextField
                                    label="Email address"
                                    placeholder="enter your email"
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                    error={errors.email}
                                    touched={touched.email}
                                    keyboardType="email-address"
                                />

                                <CommonTextField
                                    label="Password"
                                    placeholder="Password"
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values.password}
                                    error={errors.password}
                                    touched={touched.password}
                                    isPassword
                                />

                                <CommonTextField
                                    label="Confirm password"
                                    placeholder="Confirm password"
                                    onChangeText={handleChange('confirmPassword')}
                                    onBlur={handleBlur('confirmPassword')}
                                    value={values.confirmPassword}
                                    error={errors.confirmPassword}
                                    touched={touched.confirmPassword}
                                    isPassword
                                />

                                <View style={styles.buttonContainer}>
                                    <CommonButton
                                        title="SIGN UP"
                                        onPress={handleSubmit}
                                        loading={loading}
                                        style={styles.signupBtn}
                                    />
                                </View>
                            </View>
                        )}
                    </Formik>
                </ScrollView>


            </KeyboardAvoidingView>
            <View style={styles.footer}>
                <Text style={styles.footerText}>Already have account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.linkText}>Log In</Text>
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
        marginTop: verticalScale(10),
    },
    buttonContainer: {
        alignItems: 'center',
        marginVertical: verticalScale(30),
    },
    signupBtn: {
        width: moderateScale(150),
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

export default SignupScreen;
