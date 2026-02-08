import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { addToCart, removeFromCart, updateQuantity } from '../../../store/slices/cartSlice';
import CommonButton from '../../../components/CommonButton';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';

const CartItem = ({ item }: { item: any }) => {
    const dispatch = useAppDispatch();

    return (
        <View style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
                <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                    <View style={styles.checkbox}>
                        <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <Path d="M20 6L9 17L4 12" stroke={Colors.black} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                    </View>
                </View>
                <Text style={styles.itemPrice}>$ {item.price}.00</Text>
                <Text style={styles.itemMeta}>Size: {item.size}  |  Color: {item.color === '#E5C1B2' ? 'Cream' : 'Other'}</Text>

                <View style={styles.quantityContainer}>
                    <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => item.quantity > 1 ? dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 })) : dispatch(removeFromCart(item.id))}
                    >
                        <Text style={styles.qtyText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyValue}>{item.quantity}</Text>
                    <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                    >
                        <Text style={styles.qtyText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const CartScreen = () => {
    const navigation = useNavigation<any>();
    const { items } = useAppSelector(state => state.cart);

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 0; // Free shipping as per design

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <Path d="M15 18L9 12L15 6" stroke={Colors.white} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Your Cart</Text>
                <View style={{ width: 24 }} />
            </View>

            {items.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Your cart is empty</Text>
                </View>
            ) : (
                <>
                    <FlatList
                        data={items}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => <CartItem item={item} />}
                        contentContainerStyle={styles.listContent}
                    />

                    <View style={styles.footer}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Product price</Text>
                            <Text style={styles.summaryValue}>${subtotal}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Shipping</Text>
                            <Text style={styles.summaryValue}>Freeship</Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.summaryRow}>
                            <Text style={styles.totalLabel}>Subtotal</Text>
                            <Text style={styles.totalValue}>${subtotal}</Text>
                        </View>

                        <CommonButton
                            title="Proceed to checkout"
                            onPress={() => navigation.navigate('Shipping')}
                            style={{ marginTop: verticalScale(20) }}
                        />
                    </View>
                </>
            )}
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
    listContent: {
        padding: moderateScale(20),
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#111',
        borderRadius: moderateScale(15),
        padding: moderateScale(12),
        marginBottom: verticalScale(15),
    },
    itemImage: {
        width: moderateScale(100),
        height: moderateScale(100),
        borderRadius: moderateScale(10),
    },
    itemInfo: {
        flex: 1,
        marginLeft: moderateScale(15),
        justifyContent: 'space-between',
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemTitle: {
        fontSize: moderateScale(16),
        fontFamily: Theme.fontFamily.medium,
        color: Colors.white,
        flex: 1,
    },
    checkbox: {
        width: moderateScale(20),
        height: moderateScale(20),
        borderRadius: moderateScale(4),
        backgroundColor: '#4CD964',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemPrice: {
        fontSize: moderateScale(18),
        fontFamily: Theme.fontFamily.bold,
        color: Colors.white,
        marginTop: verticalScale(4),
    },
    itemMeta: {
        fontSize: moderateScale(12),
        color: '#999',
        marginTop: verticalScale(4),
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: moderateScale(20),
        alignSelf: 'flex-end',
        paddingHorizontal: moderateScale(10),
        paddingVertical: verticalScale(2),
    },
    qtyBtn: {
        paddingHorizontal: moderateScale(10),
    },
    qtyText: {
        color: Colors.white,
        fontSize: moderateScale(18),
    },
    qtyValue: {
        color: Colors.white,
        fontSize: moderateScale(14),
        fontFamily: Theme.fontFamily.bold,
        marginHorizontal: moderateScale(10),
    },
    footer: {
        backgroundColor: '#111',
        borderTopLeftRadius: moderateScale(25),
        borderTopRightRadius: moderateScale(25),
        padding: moderateScale(25),
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: verticalScale(15),
    },
    summaryLabel: {
        color: Colors.white,
        fontSize: moderateScale(14),
    },
    summaryValue: {
        color: Colors.white,
        fontSize: moderateScale(14),
        fontFamily: Theme.fontFamily.bold,
    },
    divider: {
        height: 1,
        backgroundColor: '#222',
        marginVertical: verticalScale(10),
    },
    totalLabel: {
        color: Colors.white,
        fontSize: moderateScale(18),
    },
    totalValue: {
        color: Colors.white,
        fontSize: moderateScale(22),
        fontFamily: Theme.fontFamily.bold,
    },
    checkoutBtn: {
        height: verticalScale(55),
        backgroundColor: Colors.white,
        borderRadius: moderateScale(30),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: verticalScale(25),
    },
    checkoutBtnText: {
        color: Colors.black,
        fontSize: moderateScale(16),
        fontFamily: Theme.fontFamily.bold,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        color: '#666',
        fontSize: moderateScale(16),
    }
});

export default CartScreen;
