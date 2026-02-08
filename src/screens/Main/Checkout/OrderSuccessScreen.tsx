import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { IMAGES } from '../../../constants/images';
import CommonButton from '../../../components/CommonButton';
import CheckoutStepper from '../../../components/CheckoutStepper';

const OrderSuccessScreen = () => {
    const navigation = useNavigation<any>();

    const handleContinue = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Tabs' }],
        });
    };

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

            <CheckoutStepper currentStep={3} />

            <View style={styles.content}>
                <Text style={styles.title}>Order Completed</Text>

                <View style={styles.imageContainer}>
                    <Image source={IMAGES.orderComplete} style={styles.successImage} />
                </View>

                <Text style={styles.message}>
                    Thank you for your purchase.{'\n'}
                    You can view your order in 'My Orders'{'\n'}
                    section.
                </Text>

                <CommonButton
                    title="Continue shopping"
                    onPress={handleContinue}
                />
            </View>
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
        marginBottom: verticalScale(40),
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
    stepLineActive: {
        width: moderateScale(30),
        height: 2,
        backgroundColor: Colors.white,
        marginHorizontal: 10,
    },
    content: {
        flex: 1,
        paddingHorizontal: moderateScale(30),
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: verticalScale(50),
    },
    title: {
        fontSize: moderateScale(24),
        fontFamily: Theme.fontFamily.bold,
        color: Colors.white,
        marginBottom: verticalScale(40),
    },
    imageContainer: {
        marginBottom: verticalScale(40),
        alignItems: 'center',
        justifyContent: 'center',
    },
    successImage: {
        width: moderateScale(100),
        height: moderateScale(100),
        resizeMode: 'contain',
        tintColor: Colors.white, // Assuming icon is white or should inherit white
    },
    message: {
        color: '#ccc',
        fontSize: moderateScale(14),
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: verticalScale(50),
    },
    continueBtn: {
        backgroundColor: Colors.white,
        height: verticalScale(55),
        borderRadius: moderateScale(30),
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    continueText: {
        color: Colors.black,
        fontSize: moderateScale(16),
        fontFamily: Theme.fontFamily.bold,
    },
});

export default OrderSuccessScreen;
