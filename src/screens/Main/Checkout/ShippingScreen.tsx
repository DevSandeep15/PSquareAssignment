import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { IMAGES } from '../../../constants/images';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CommonButton from '../../../components/CommonButton';
import CommonTextField from '../../../components/CommonTextField';
import CheckoutStepper from '../../../components/CheckoutStepper';

const ShippingSchema = Yup.object().shape({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    country: Yup.string().required('Required'),
    street: Yup.string().required('Required'),
    city: Yup.string().required('Required'),
    state: Yup.string(),
    zipCode: Yup.string().required('Required'),
    phone: Yup.string().required('Required'),
});

const shippingMethods = [
    { id: 'free', name: 'Free', price: 0, deliveryTime: 'Delivery from 3 to 7 business days' },
    { id: 'standard', name: '$ 9.90', price: 9.90, deliveryTime: 'Delivery from 4 to 6 business days' },
    { id: 'fast', name: '$ 9.90', price: 9.90, deliveryTime: 'Delivery from 2 to 3 business days' },
];

const ShippingScreen = () => {
    const navigation = useNavigation<any>();
    const [selectedMethod, setSelectedMethod] = useState(shippingMethods[0].id);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Image
                        source={IMAGES.rightArrow}
                        style={[styles.icon, { transform: [{ rotate: '180deg' }], tintColor: Colors.white }]}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Check out</Text>
                <View style={{ width: 40 }} />
            </View>

            <CheckoutStepper currentStep={1} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                <Text style={styles.stepTitle}>STEP 1</Text>
                <Text style={styles.pageTitle}>Shipping</Text>

                <Formik
                    initialValues={{
                        firstName: '',
                        lastName: '',
                        country: '',
                        street: '',
                        city: '',
                        state: '',
                        zipCode: '',
                        phone: '',
                    }}
                    validationSchema={ShippingSchema}
                    onSubmit={values => {
                        navigation.navigate('Payment', {
                            shippingAddress: values,
                            shippingMethod: shippingMethods.find(m => m.id === selectedMethod),
                        });
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <View>
                            <CommonTextField
                                label="First name *"
                                value={values.firstName}
                                onChangeText={handleChange('firstName')}
                                onBlur={handleBlur('firstName')}
                                placeholder="Enter first name"
                                error={errors.firstName}
                                touched={touched.firstName}
                            />

                            <CommonTextField
                                label="Last name *"
                                value={values.lastName}
                                onChangeText={handleChange('lastName')}
                                onBlur={handleBlur('lastName')}
                                placeholder="Enter last name"
                                error={errors.lastName}
                                touched={touched.lastName}
                            />

                            <CommonTextField
                                label="Country *"
                                value={values.country}
                                onChangeText={handleChange('country')}
                                onBlur={handleBlur('country')}
                                placeholder="Select Country"
                                error={errors.country}
                                touched={touched.country}
                            />

                            <CommonTextField
                                label="Street name *"
                                value={values.street}
                                onChangeText={handleChange('street')}
                                onBlur={handleBlur('street')}
                                placeholder="Enter street name"
                                error={errors.street}
                                touched={touched.street}
                            />

                            <CommonTextField
                                label="City *"
                                value={values.city}
                                onChangeText={handleChange('city')}
                                onBlur={handleBlur('city')}
                                placeholder="Enter city"
                                error={errors.city}
                                touched={touched.city}
                            />

                            <CommonTextField
                                label="State / Province"
                                value={values.state}
                                onChangeText={handleChange('state')}
                                onBlur={handleBlur('state')}
                                placeholder="Enter state"
                            />

                            <CommonTextField
                                label="Zip-code *"
                                value={values.zipCode}
                                onChangeText={handleChange('zipCode')}
                                onBlur={handleBlur('zipCode')}
                                placeholder="Enter zip code"
                                error={errors.zipCode}
                                touched={touched.zipCode}
                            />

                            <CommonTextField
                                label="Phone number *"
                                value={values.phone}
                                onChangeText={handleChange('phone')}
                                onBlur={handleBlur('phone')}
                                placeholder="Enter phone number"
                                keyboardType="phone-pad"
                                error={errors.phone}
                                touched={touched.phone}
                            />

                            <Text style={styles.sectionTitle}>Shipping method</Text>
                            {shippingMethods.map((method) => (
                                <TouchableOpacity
                                    key={method.id}
                                    style={[styles.methodCard, selectedMethod === method.id && styles.selectedMethod]}
                                    onPress={() => setSelectedMethod(method.id)}
                                >
                                    <View style={styles.radioOuter}>
                                        {selectedMethod === method.id && <View style={styles.radioInner} />}
                                    </View>
                                    <View style={{ marginLeft: 15 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={styles.methodName}>{method.name}</Text>
                                            <Text style={styles.deliveryType}>{method.id === 'free' ? 'Delivery to home' : method.name === '$ 9.90' ? 'Delivery to home' : 'Fast Delivery'}</Text>
                                        </View>
                                        <Text style={styles.deliveryTime}>{method.deliveryTime}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}

                            <Text style={styles.sectionTitle}>Coupon Code</Text>
                            <View style={styles.couponContainer}>
                                <TextInput
                                    style={styles.couponInput}
                                    placeholder="Have a code? type it here..."
                                    placeholderTextColor="#666"
                                />
                                <TouchableOpacity>
                                    <Text style={styles.validateText}>Validate</Text>
                                </TouchableOpacity>
                            </View>



                            <CommonButton
                                title="Continue to payment"
                                onPress={() => handleSubmit()}
                            />
                        </View>
                    )}
                </Formik>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundgray,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: moderateScale(20),
        paddingVertical: verticalScale(15),
    },
    headerTitle: {
        fontSize: moderateScale(18),
        fontFamily: Theme.fontFamily.bold,
        color: Colors.white,
    },
    backBtn: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(20),
        backgroundColor: '#222',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: moderateScale(24),
        height: moderateScale(24),
        resizeMode: 'contain',
    },
    stepper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(20),
    },
    stepActive: {
        width: moderateScale(30),
        height: moderateScale(30),
        borderRadius: moderateScale(15),
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepTextActive: {
        color: Colors.black,
        fontSize: moderateScale(14),
        fontWeight: 'bold',
    },
    stepInactive: {
        width: moderateScale(30),
        height: moderateScale(30),
        borderRadius: moderateScale(15),
        borderWidth: 1,
        borderColor: '#666',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepTextInactive: {
        color: '#666',
        fontSize: moderateScale(14),
    },
    stepLine: {
        width: moderateScale(30),
        height: 2,
        backgroundColor: '#333',
        marginHorizontal: 10,
    },
    stepLineActive: {
        width: moderateScale(30),
        height: 2,
        backgroundColor: Colors.white,
        marginHorizontal: 10,
    },
    content: {
        paddingHorizontal: moderateScale(20),
        paddingBottom: verticalScale(30),
    },
    stepTitle: {
        color: '#999',
        fontSize: moderateScale(12),
        marginBottom: verticalScale(5),
    },
    pageTitle: {
        color: Colors.white,
        fontSize: moderateScale(24),
        fontFamily: Theme.fontFamily.bold,
        marginBottom: verticalScale(25),
    },

    sectionTitle: {
        color: Colors.white,
        fontSize: moderateScale(16),
        fontFamily: Theme.fontFamily.bold,
        marginTop: verticalScale(30),
        marginBottom: verticalScale(15),
    },
    methodCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1E', // Darker background for method
        padding: moderateScale(15),
        borderRadius: moderateScale(10),
        marginBottom: verticalScale(10),
    },
    selectedMethod: {
        backgroundColor: '#2C2C2E',
        borderWidth: 1,
        borderColor: '#4CD964',
    },
    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#666',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#4CD964',
    },
    methodName: {
        color: Colors.white,
        fontSize: moderateScale(14),
        fontFamily: Theme.fontFamily.bold,
        marginRight: 10,
    },
    deliveryType: {
        color: Colors.white,
        fontSize: moderateScale(14),
    },
    deliveryTime: {
        color: '#999',
        fontSize: moderateScale(12),
        marginTop: 4,
    },
    couponContainer: {
        flexDirection: 'row',
        backgroundColor: '#2C2C2E',
        borderRadius: moderateScale(10),
        paddingHorizontal: moderateScale(15),
        alignItems: 'center',
        height: verticalScale(50),
        marginBottom: verticalScale(15),
    },
    couponInput: {
        flex: 1,
        color: Colors.white,
    },
    validateText: {
        color: '#4CD964',
        fontWeight: 'bold',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(30),
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#666',
        marginRight: 10,
    },
    checkboxLabel: {
        color: '#ccc',
        fontSize: moderateScale(14),
    },
    continueBtn: {
        backgroundColor: Colors.white,
        height: verticalScale(55),
        borderRadius: moderateScale(30),
        justifyContent: 'center',
        alignItems: 'center',
    },
    continueText: {
        color: Colors.black,
        fontSize: moderateScale(16),
        fontFamily: Theme.fontFamily.bold,
    },
});

export default ShippingScreen;
