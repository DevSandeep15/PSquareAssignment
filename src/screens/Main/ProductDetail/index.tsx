import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Dimensions,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { useNavigation, useRoute } from '@react-navigation/native';
import { productService } from '../../../api/productService';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { addToCart } from '../../../store/slices/cartSlice';
import Svg, { Path } from 'react-native-svg';
import Toast from 'react-native-toast-message';
import { IMAGES } from '../../../constants/images';

const { width } = Dimensions.get('window');

const ProductDetailScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { productId } = route.params;
    const dispatch = useAppDispatch();
    const { items } = useAppSelector(state => state.cart);

    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('M');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [descriptionExpanded, setDescriptionExpanded] = useState(false);
    const [reviewsExpanded, setReviewsExpanded] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    const isInCart = product ? items.some(item => item.id === product.id) : false;

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const data = await productService.getSingleProduct(productId);
                setProduct(data);
            } catch (error) {
                console.error(error);
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to load product details',
                });
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [productId]);

    const handleAddToCart = () => {
        if (product) {
            dispatch(addToCart({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.images[0],
                quantity: 1,
                size: selectedSize,
            }));
            Toast.show({
                type: 'success',
                text1: 'Added to Cart',
                text2: `${product.title} has been added.`,
            });
        }
    };

    const toggleLike = () => {
        setIsLiked(!isLiked);
        if (!isLiked) {
            Toast.show({
                type: 'success',
                text1: 'Added to Wishlist',
                text2: 'This item has been added to your wishlist.',
                visibilityTime: 2000,
            });
        }
    };

    const handleScroll = (event: any) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / width);
        setCurrentImageIndex(index);
    };

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color={Colors.white} />
            </View>
        );
    }

    if (!product) return null;

    const images = product.images || [];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Image Section */}
                <View style={styles.imageContainer}>
                    <FlatList
                        data={images}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item }) => (
                            <Image source={{ uri: item }} style={{ width, height: '100%', resizeMode: 'cover' }} />
                        )}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                    />

                    {/* Pagination Dots */}
                    <View style={styles.pagination}>
                        {images.map((_: any, index: number) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    currentImageIndex === index && styles.activeDot,
                                ]}
                            />
                        ))}
                    </View>

                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <Path d="M15 18L9 12L15 6" stroke={Colors.white} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.heartButton} onPress={toggleLike}>
                        <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <Path
                                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                                fill={isLiked ? "#FF6B6B" : "none"}
                                stroke={isLiked ? "#FF6B6B" : "#FF6B6B"}
                                strokeWidth="2"
                            />
                        </Svg>
                    </TouchableOpacity>
                </View>

                {/* Details Section */}
                <View style={styles.detailsContainer}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>{product.title}</Text>
                        <Text style={styles.price}>$ {product.price}.00</Text>
                    </View>

                    {/* Ratings */}
                    <View style={styles.ratingRow}>
                        {[1, 2, 3, 4, 5].map(i => (
                            <Svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i <= 4 ? "#4CD964" : "none"} stroke={i <= 4 ? "#4CD964" : "#666"}>
                                <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </Svg>
                        ))}
                        <Text style={styles.ratingCount}>(123)</Text>
                    </View>

                    {/* Size */}
                    <View style={styles.optionsRow}>
                        <View>
                            <Text style={styles.optionLabel}>Size</Text>
                            <View style={styles.sizeRow}>
                                {['S', 'M', 'L'].map(size => (
                                    <TouchableOpacity
                                        key={size}
                                        style={[styles.sizeBox, selectedSize === size && styles.selectedSizeBox]}
                                        onPress={() => setSelectedSize(size)}
                                    >
                                        <Text style={[styles.sizeText, selectedSize === size && styles.selectedSizeText]}>{size}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>


                    </View>

                    {/* Description */}
                    <TouchableOpacity
                        style={styles.expandableItem}
                        onPress={() => setDescriptionExpanded(!descriptionExpanded)}
                    >
                        <Text style={styles.expandableTitle}>Description</Text>
                        <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ transform: [{ rotate: descriptionExpanded ? '270deg' : '90deg' }] }}>
                            <Path d="M9 18l6-6-6-6" stroke={Colors.white} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                    </TouchableOpacity>
                    {descriptionExpanded && (
                        <View style={styles.expandableContent}>
                            <Text style={styles.descriptionText}>
                                {product.description}
                            </Text>
                        </View>
                    )}

                    {/* Reviews */}
                    <TouchableOpacity
                        style={styles.expandableItem}
                        onPress={() => setReviewsExpanded(!reviewsExpanded)}
                    >
                        <Text style={styles.expandableTitle}>Reviews</Text>
                        <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ transform: [{ rotate: reviewsExpanded ? '270deg' : '90deg' }] }}>
                            <Path d="M9 18l6-6-6-6" stroke={Colors.white} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                    </TouchableOpacity>
                    {reviewsExpanded && (
                        <View style={styles.expandableContent}>
                            <View style={styles.reviewSummary}>
                                <Text style={styles.bigRating}>4.9</Text>
                                <Text style={styles.outOf}>OUT OF 5</Text>
                            </View>

                            {/* Static Reviews for demo */}
                            <View style={styles.reviewItem}>
                                <View style={styles.reviewHeader}>
                                    <View style={styles.avatar} />
                                    <View>
                                        <Text style={styles.reviewerName}>Jennifer Rose</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <Svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#4CD964">
                                                    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                </Svg>
                                            ))}
                                        </View>
                                    </View>
                                    <Text style={styles.reviewTime}>5m ago</Text>
                                </View>
                                <Text style={styles.reviewText}>
                                    I love it. Awesome customer service! Helped me out with adding an additional item to my order. Thanks again!
                                </Text>
                            </View>

                            <View style={styles.reviewItem}>
                                <View style={styles.reviewHeader}>
                                    <View style={styles.avatar} />
                                    <View>
                                        <Text style={styles.reviewerName}>Kelly Rihana</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <Svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#4CD964">
                                                    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                </Svg>
                                            ))}
                                        </View>
                                    </View>
                                    <Text style={styles.reviewTime}>15m ago</Text>
                                </View>
                                <Text style={styles.reviewText}>
                                    I'm very happy with order. It was delivered on time and good quality. Recommended!
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Similar Product placeholder */}
                    <TouchableOpacity style={styles.expandableItem}>
                        <Text style={styles.expandableTitle}>Similar Product</Text>
                        <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <Path d="M9 18l6-6-6-6" stroke={Colors.white} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Bottom Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.addBtn, isInCart && styles.disabledBtn]}
                    onPress={handleAddToCart}
                    disabled={isInCart}
                >
                    <Image source={IMAGES.cartIcon} style={styles.cartIcon} tintColor={isInCart ? '#999' : Colors.white} />
                    <Text style={[styles.addBtnText, isInCart && styles.disabledBtnText]}>
                        {isInCart ? "Added to Cart" : "Add To Cart"}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundgray,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.backgroundgray,
    },
    imageContainer: {
        height: verticalScale(400),
        width: width,
        position: 'relative',
    },
    image: {
        width: width,
        height: '100%',
        resizeMode: 'cover',
    },
    pagination: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        marginHorizontal: 3,
    },
    activeDot: {
        backgroundColor: Colors.white,
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    backButton: {
        position: 'absolute',
        top: verticalScale(20),
        left: moderateScale(20),
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(20),
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heartButton: {
        position: 'absolute',
        top: verticalScale(20),
        right: moderateScale(20),
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(20),
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailsContainer: {
        flex: 1,
        backgroundColor: '#111',
        borderTopLeftRadius: moderateScale(30),
        borderTopRightRadius: moderateScale(30),
        marginTop: verticalScale(-30),
        padding: moderateScale(20),
        minHeight: 500, // Ensure background covers enough space
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(10),
    },
    title: {
        fontSize: moderateScale(20),
        fontFamily: Theme.fontFamily.bold,
        color: Colors.white,
        flex: 1,
    },
    price: {
        fontSize: moderateScale(24),
        fontFamily: Theme.fontFamily.bold,
        color: Colors.white,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(25),
    },
    ratingCount: {
        color: '#999',
        fontSize: moderateScale(12),
        marginLeft: moderateScale(8),
    },
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: verticalScale(30),
    },
    optionLabel: {
        color: '#999',
        fontSize: moderateScale(12),
        marginBottom: verticalScale(10),
    },
    colorRow: {
        flexDirection: 'row',
    },
    colorCircle: {
        width: moderateScale(24),
        height: moderateScale(24),
        borderRadius: moderateScale(12),
        marginRight: moderateScale(10),
    },
    selectedCircle: {
        borderWidth: 2,
        borderColor: Colors.white,
    },
    sizeRow: {
        flexDirection: 'row',
    },
    sizeBox: {
        width: moderateScale(36),
        height: moderateScale(36),
        borderRadius: moderateScale(18),
        backgroundColor: '#222',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: moderateScale(10),
    },
    selectedSizeBox: {
        backgroundColor: Colors.white,
    },
    sizeText: {
        color: Colors.white,
        fontSize: moderateScale(12),
        fontFamily: Theme.fontFamily.bold,
    },
    selectedSizeText: {
        color: Colors.black,
    },
    expandableItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: verticalScale(15),
        borderTopWidth: 0.5,
        borderColor: '#333',
    },
    expandableTitle: {
        fontSize: moderateScale(16),
        fontFamily: Theme.fontFamily.medium,
        color: Colors.white,
    },
    expandableContent: {
        paddingVertical: 10,
    },
    descriptionText: {
        color: '#ccc',
        fontSize: moderateScale(14),
        lineHeight: 20,
    },
    reviewSummary: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    bigRating: {
        fontSize: 48,
        color: Colors.white,
        fontWeight: 'bold',
        marginRight: 10,
    },
    outOf: {
        color: '#999',
        fontSize: 12,
        marginTop: 10,
    },
    reviewItem: {
        marginBottom: 20,
    },
    reviewHeader: {
        flexDirection: 'row',
        marginBottom: 8,
        alignItems: 'center',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#333',
        marginRight: 10,
    },
    reviewerName: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 12,
    },
    reviewTime: {
        color: '#666',
        fontSize: 10,
        marginLeft: 'auto',
    },
    reviewText: {
        color: '#ccc',
        fontSize: 12,
        lineHeight: 18,
    },
    footer: {
        padding: moderateScale(20),
        backgroundColor: Colors.backgroundgray,
    },
    addBtn: {
        height: verticalScale(55),
        backgroundColor: '#444',
        borderRadius: moderateScale(15),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addBtnText: {
        color: Colors.white,
        fontSize: moderateScale(16),
        fontFamily: Theme.fontFamily.bold,
    },
    disabledBtn: {
        backgroundColor: '#2C2C2E',
        borderWidth: 1,
        borderColor: '#444',
    },
    disabledBtnText: {
        color: '#999',
    },
    cartIcon: {
        height: moderateScale(17),
        width: moderateScale(17),
        marginRight: moderateScale(5),
        marginBottom: moderateScale(5),
    }
});

export default ProductDetailScreen;
