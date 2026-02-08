import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { productService } from '../../../api/productService';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - moderateScale(50)) / 2;

const ProductListScreen = () => {
    const navigation = useNavigation<any>();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const LIMIT = 10;

    const fetchProducts = useCallback(async (currentOffset: number) => {
        if (loading || (loadingMore && currentOffset > 0)) return;

        if (currentOffset === 0) setLoading(true);
        else setLoadingMore(true);

        try {
            const data = await productService.getAllProducts(currentOffset, LIMIT);
            if (data.length < LIMIT) {
                setHasMore(false);
            }
            if (currentOffset === 0) {
                setProducts(data);
            } else {
                setProducts(prev => [...prev, ...data]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [loading, loadingMore]);

    useEffect(() => {
        fetchProducts(0);
    }, []);

    const handleLoadMore = () => {
        if (!loadingMore && hasMore) {
            const nextOffset = offset + LIMIT;
            setOffset(nextOffset);
            fetchProducts(nextOffset);
        }
    };

    const renderProduct = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.productCard}
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
        >
            <Image source={{ uri: item.images[0] }} style={styles.productImage} />
            <View style={styles.productInfo}>
                <Text style={styles.productTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.productPrice}>$ {item.price}.00</Text>
            </View>
        </TouchableOpacity>
    );

    const renderFooter = () => {
        if (!loadingMore) return null;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator color={Colors.white} />
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <Path d="M15 18L9 12L15 6" stroke={Colors.white} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>All Products</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading && offset === 0 ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={Colors.white} />
                </View>
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderProduct}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={styles.listContent}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                />
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
        paddingHorizontal: moderateScale(15),
        paddingBottom: verticalScale(20),
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: verticalScale(15),
    },
    productCard: {
        width: COLUMN_WIDTH,
        backgroundColor: '#111',
        borderRadius: moderateScale(15),
        overflow: 'hidden',
    },
    productImage: {
        width: '100%',
        height: verticalScale(180),
        resizeMode: 'cover',
    },
    productInfo: {
        padding: moderateScale(10),
    },
    productTitle: {
        color: Colors.white,
        fontFamily: Theme.fontFamily.medium,
        fontSize: moderateScale(14),
        marginBottom: verticalScale(4),
    },
    productPrice: {
        color: Colors.white,
        fontFamily: Theme.fontFamily.bold,
        fontSize: moderateScale(16),
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerLoader: {
        paddingVertical: verticalScale(20),
        alignItems: 'center',
    },
});

export default ProductListScreen;
