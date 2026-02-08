import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { useNavigation, useRoute } from '@react-navigation/native';
import { IMAGES } from '../../../constants/images';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { createOrder } from '../../../store/slices/orderSlice';
import { clearCart } from '../../../store/slices/cartSlice';
import CommonButton from '../../../components/CommonButton';
import CheckoutStepper from '../../../components/CheckoutStepper';
import Toast from 'react-native-toast-message';

const cards = [
    { id: 'paypal', image: IMAGES.paypal },
    { id: 'visa', image: IMAGES.visa },
    { id: 'master', image: IMAGES.mastercard },
    { id: 'alipay', image: IMAGES.alipay },
    { id: 'amex', image: IMAGES.amex },
];

const PaymentScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const dispatch = useAppDispatch();
    const { items } = useAppSelector(state => state.cart);
    const { shippingAddress, shippingMethod } = route.params;

    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [selectedCard, setSelectedCard] = useState('visa');

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = shippingMethod?.price || 0;
    const total = subtotal + shippingCost;

    const handlePlaceOrder = () => {
        dispatch(createOrder({
            items,
            shippingAddress,
            shippingMethod,
            total,
        }));
        dispatch(clearCart());

        Toast.show({
            type: 'success',
            text1: 'Order Placed!',
            text2: 'Your order has been successfully placed.',
        });

        // Navigate to Order Success
        navigation.navigate('OrderSuccess');
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

            <CheckoutStepper currentStep={2} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                <Text style={styles.stepTitle}>STEP 2</Text>
                <Text style={styles.pageTitle}>Payment</Text>

                <View style={styles.paymentTabs}>
                    <TouchableOpacity
                        style={[styles.tab, paymentMethod === 'cash' && styles.activeTab]}
                        onPress={() => setPaymentMethod('cash')}
                    >
                        <Image source={IMAGES.cardIcon} style={[styles.tabIcon, paymentMethod === 'cash' && { tintColor: Colors.black }]} />
                        <Text style={[styles.tabText, paymentMethod === 'cash' && { color: Colors.black }]}>Cash</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, paymentMethod === 'credit_card' && styles.activeTab]}
                        onPress={() => setPaymentMethod('credit_card')}
                    >
                        <Image source={IMAGES.cardIcon} style={[styles.tabIcon, paymentMethod === 'credit_card' && { tintColor: Colors.black }]} />
                        <Text style={[styles.tabText, paymentMethod === 'credit_card' && { color: Colors.black }]}>Credit Card</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, paymentMethod === 'more' && styles.activeTab]}
                        onPress={() => setPaymentMethod('more')}
                    >
                        <Image source={IMAGES.moreIcon} style={[styles.tabIcon, paymentMethod === 'more' && { tintColor: Colors.black }]} />
                        <Text style={[styles.tabText, paymentMethod === 'more' && { color: Colors.black }]}>More</Text>
                    </TouchableOpacity>
                </View>

                {paymentMethod === 'credit_card' && (
                    <View>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Choose your card</Text>
                            <TouchableOpacity onPress={() => Alert.alert('service unavaible')}>
                                <Text style={styles.addNewText}>Add new+</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.cardList}>
                            {cards.map((card) => (
                                <TouchableOpacity
                                    key={card.id}
                                    style={[styles.cardOption, selectedCard === card.id && styles.selectedCardOption]}
                                    onPress={() => setSelectedCard(card.id)}
                                >
                                    <View style={[styles.cardBg, { backgroundColor: '#fff' }]}>
                                        <Image source={card.image} style={styles.cardLogo} />
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                <View style={styles.summaryContainer}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Product price</Text>
                        <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Shipping</Text>
                        <Text style={styles.summaryValue}>
                            {shippingCost === 0 ? 'Freeship' : `$${shippingCost.toFixed(2)}`}
                        </Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.summaryRow}>
                        <Text style={styles.totalLabel}>Subtotal</Text>
                        <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
                    </View>
                </View>

                <View style={styles.termsContainer}>
                    <TouchableOpacity style={styles.checkbox}>
                        <View style={styles.innerCheck} />
                    </TouchableOpacity>
                    <Text style={styles.termsText}>I agree to Terms and conditions</Text>
                </View>

                <CommonButton
                    title="Place my order"
                    onPress={handlePlaceOrder}
                />

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
    paymentTabs: {
        flexDirection: 'row',
        marginBottom: verticalScale(30),
    },
    tab: {
        flex: 1,
        backgroundColor: '#1C1C1E',
        borderRadius: moderateScale(10),
        paddingVertical: verticalScale(15),
        alignItems: 'center',
        marginRight: moderateScale(10),
        borderWidth: 1,
        borderColor: 'transparent',
    },
    activeTab: {
        backgroundColor: Colors.white,
        borderColor: Colors.white,
    },
    tabIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
        tintColor: Colors.white,
    },
    tabText: {
        color: Colors.white,
        marginTop: 8,
        fontSize: moderateScale(12),
        fontWeight: 'bold',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(15),
    },
    sectionTitle: {
        color: Colors.white,
        fontSize: moderateScale(16),
        fontFamily: Theme.fontFamily.bold,
    },
    addNewText: {
        color: '#FF6B6B',
        fontSize: moderateScale(12),
    },
    cardList: {
        flexDirection: 'row',
        marginBottom: verticalScale(30),
        flexWrap: 'wrap',
    },
    cardOption: {
        marginRight: moderateScale(10),
        marginBottom: verticalScale(10),
        padding: 2,
        borderRadius: 8,
    },
    selectedCardOption: {
        borderWidth: 1,
        borderColor: Colors.white,
    },
    cardBg: {
        width: moderateScale(50),
        height: moderateScale(35),
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    cardLogo: {
        width: '80%',
        height: '80%',
        resizeMode: 'contain',
    },
    summaryContainer: {
        backgroundColor: '#1C1C1E',
        borderRadius: moderateScale(15),
        padding: moderateScale(20),
        marginBottom: verticalScale(25),
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: verticalScale(10),
    },
    summaryLabel: {
        color: '#ccc',
        fontSize: moderateScale(14),
    },
    summaryValue: {
        color: Colors.white,
        fontSize: moderateScale(14),
        fontFamily: Theme.fontFamily.bold,
    },
    divider: {
        height: 1,
        backgroundColor: '#333',
        marginVertical: verticalScale(10),
    },
    totalLabel: {
        color: Colors.white,
        fontSize: moderateScale(16),
    },
    totalValue: {
        color: Colors.white,
        fontSize: moderateScale(20),
        fontFamily: Theme.fontFamily.bold,
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(30),
    },
    checkbox: {
        width: 20,
        height: 20,
        backgroundColor: '#4CD964',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    innerCheck: {
        width: 10,
        height: 10,
        backgroundColor: 'white',
        borderRadius: 2
    },
    termsText: {
        color: '#ccc',
        fontSize: moderateScale(14),
    },
    placeOrderBtn: {
        backgroundColor: Colors.white,
        height: verticalScale(55),
        borderRadius: moderateScale(30),
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeOrderText: {
        color: Colors.black,
        fontSize: moderateScale(16),
        fontFamily: Theme.fontFamily.bold,
    },
});

export default PaymentScreen;
