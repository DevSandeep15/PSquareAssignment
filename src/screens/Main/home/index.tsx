import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    FlatList,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import Svg, { Path, Circle } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchCategories, fetchProducts } from '../../../store/slices/productSlice';

const { width } = Dimensions.get('window');

const CategoryItem = ({ item, isSelected, onPress }: { item: any; isSelected: boolean; onPress: () => void }) => (
    <TouchableOpacity style={styles.categoryContainer} onPress={onPress}>
        <View style={[styles.categoryIcon, isSelected && styles.selectedCategoryIcon]}>
            <Image
                source={{ uri: item.image }}
                style={[styles.categoryImage, isSelected && styles.selectedCategoryImage]}
            />
        </View>
        <Text style={[styles.categoryName, isSelected && styles.selectedCategoryName]} numberOfLines={1}>
            {item.name}
        </Text>
    </TouchableOpacity>
);

const SectionHeader = ({ title, onPress }: { title: string; onPress?: () => void }) => (
    <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity onPress={onPress}>
            <Text style={styles.showAll}>Show all</Text>
        </TouchableOpacity>
    </View>
);

const ProductCard = ({ item, onPress }: { item: any; onPress: () => void }) => (
    <TouchableOpacity style={styles.productCard} onPress={onPress}>
        <Image source={{ uri: item.images[0] }} style={styles.productImage} />
        <Text style={styles.productName} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.productPrice}>$ {item.price}.00</Text>
    </TouchableOpacity>
);

const RecommendedCard = ({ item, onPress }: { item: any; onPress: () => void }) => (
    <TouchableOpacity style={styles.recommendedCard} onPress={onPress}>
        <View style={styles.recommendedContent}>
            <Image source={{ uri: item.images[0] }} style={styles.recommendedImage} />
            <View style={styles.recommendedInfo}>
                <Text style={styles.recommendedName} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.recommendedPrice}>$ {item.price}.00</Text>
            </View>
        </View>
    </TouchableOpacity>
);

const HomeScreen = () => {
    const navigation = useNavigation<any>();
    const dispatch = useAppDispatch();
    const { products, categories, loading, error } = useAppSelector(state => state.product);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    const loadData = () => {
        dispatch(fetchCategories());
        dispatch(fetchProducts(30));
    };

    useEffect(() => {
        loadData();
    }, [dispatch]);

    const filteredProducts = selectedCategoryId
        ? products.filter(p => p.category.id === selectedCategoryId)
        : products;

    if (loading && products.length === 0) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color={Colors.white} />
            </View>
        );
    }

    if (error && products.length === 0) {
        return (
            <SafeAreaView style={styles.errorContainer}>
                <Svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                    <Path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryBtn} onPress={loadData}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Stylinx</Text>
                </View>

                {/* Categories */}
                <View style={styles.categoriesSection}>
                    <FlatList
                        data={categories.slice(0, 5)}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <CategoryItem
                                item={item}
                                isSelected={selectedCategoryId === item.id}
                                onPress={() => setSelectedCategoryId(selectedCategoryId === item.id ? null : item.id)}
                            />
                        )}
                        contentContainerStyle={styles.categoryList}
                    />
                </View>

                {/* Hero Banner */}
                <View style={styles.heroBanner}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800' }}
                        style={styles.heroImage}
                    />
                    <View style={styles.heroOverlay}>
                        <Text style={styles.heroTitle}>Autumn{'\n'}Collection{'\n'}2021</Text>
                        <View style={styles.heroDots}>
                            <View style={[styles.dot, styles.activeDot]} />
                            <View style={styles.dot} />
                            <View style={styles.dot} />
                        </View>
                    </View>
                </View>

                {/* Feature Products */}
                <View style={styles.section}>
                    <SectionHeader title="Feature Products" onPress={() => navigation.navigate('ProductList')} />
                    <FlatList
                        data={filteredProducts.slice(0, 6)}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <ProductCard
                                item={item}
                                onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
                            />
                        )}
                        contentContainerStyle={styles.productList}
                    />
                </View>

                {/* Promo Banner */}
                <View style={styles.promoBanner}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800' }}
                        style={styles.promoImage}
                    />
                    <View style={styles.promoOverlay}>
                        <View style={styles.promoLabelContainer}>
                            <View style={styles.promoLine} />
                            <Text style={styles.promoLabel}>NEW COLLECTION</Text>
                        </View>
                        <Text style={styles.promoTitle}>HANG OUT{'\n'}& PARTY</Text>
                    </View>
                </View>

                {/* Recommended */}
                <View style={styles.section}>
                    <SectionHeader title="Recommended" onPress={() => navigation.navigate('ProductList')} />
                    <FlatList
                        data={products.slice(10, 16)}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <RecommendedCard
                                item={item}
                                onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
                            />
                        )}
                        contentContainerStyle={styles.productList}
                    />
                </View>

                {/* Top Collection */}
                <View style={styles.section}>
                    <SectionHeader title="Top Collection" />
                    <View style={styles.topCollectionBanner}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1537832816519-689ad163238b?w=800' }}
                            style={styles.heroImage}
                        />
                        <View style={styles.promoOverlay}>
                            <View style={styles.promoLabelContainer}>
                                <View style={styles.promoLine} />
                                <Text style={styles.promoLabel}>Sale up to 40%</Text>
                            </View>
                            <Text style={styles.promoTitle}>FOR SLIM{'\n'}& BEAUTY</Text>
                        </View>
                    </View>
                </View>

                <View style={{ height: verticalScale(20) }} />
            </ScrollView>
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
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.backgroundgray,
        padding: moderateScale(20),
    },
    errorText: {
        color: '#FF6B6B',
        fontSize: moderateScale(16),
        fontFamily: Theme.fontFamily.medium,
        textAlign: 'center',
        marginTop: verticalScale(20),
        marginBottom: verticalScale(30),
    },
    retryBtn: {
        backgroundColor: Colors.white,
        paddingHorizontal: moderateScale(40),
        paddingVertical: verticalScale(12),
        borderRadius: moderateScale(25),
    },
    retryText: {
        color: Colors.black,
        fontSize: moderateScale(14),
        fontFamily: Theme.fontFamily.bold,
    },
    header: {
        alignItems: 'center',
        paddingVertical: verticalScale(15),
    },
    headerTitle: {
        fontSize: moderateScale(22),
        fontFamily: Theme.fontFamily.bold,
        color: Colors.white,
    },
    categoriesSection: {
        marginBottom: verticalScale(20),
    },
    categoryList: {
        paddingHorizontal: moderateScale(20),
    },
    categoryContainer: {
        alignItems: 'center',
        marginRight: moderateScale(25),
        width: moderateScale(70),
    },
    categoryIcon: {
        width: moderateScale(45),
        height: moderateScale(45),
        borderRadius: moderateScale(22.5),
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(8),
    },
    selectedCategoryIcon: {
        borderColor: Colors.white,
        borderWidth: 2,
    },
    categoryImage: {
        width: moderateScale(30),
        height: moderateScale(30),
        borderRadius: moderateScale(15),
        opacity: 0.6,
    },
    selectedCategoryImage: {
        opacity: 1,
    },
    categoryName: {
        fontSize: moderateScale(11),
        fontFamily: Theme.fontFamily.medium,
        color: Colors.textSecondary,
    },
    selectedCategoryName: {
        color: Colors.white,
    },
    heroBanner: {
        height: verticalScale(180),
        marginHorizontal: moderateScale(20),
        borderRadius: moderateScale(15),
        overflow: 'hidden',
        marginBottom: verticalScale(25),
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.2)',
        padding: moderateScale(20),
        justifyContent: 'space-between',
    },
    heroTitle: {
        fontSize: moderateScale(24),
        fontFamily: Theme.fontFamily.bold,
        color: Colors.white,
        lineHeight: moderateScale(30),
    },
    heroDots: {
        flexDirection: 'row',
    },
    dot: {
        width: moderateScale(6),
        height: moderateScale(6),
        borderRadius: moderateScale(3),
        backgroundColor: 'rgba(255,255,255,0.4)',
        marginRight: moderateScale(6),
    },
    activeDot: {
        backgroundColor: Colors.white,
        width: moderateScale(12),
    },
    section: {
        marginBottom: verticalScale(25),
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: moderateScale(20),
        marginBottom: verticalScale(15),
    },
    sectionTitle: {
        fontSize: moderateScale(18),
        fontFamily: Theme.fontFamily.bold,
        color: Colors.white,
    },
    showAll: {
        fontSize: moderateScale(12),
        color: Colors.textSecondary,
    },
    productList: {
        paddingHorizontal: moderateScale(20),
    },
    productCard: {
        width: moderateScale(140),
        marginRight: moderateScale(15),
    },
    productImage: {
        width: '100%',
        height: verticalScale(160),
        borderRadius: moderateScale(12),
        marginBottom: verticalScale(8),
    },
    productName: {
        fontSize: moderateScale(14),
        fontFamily: Theme.fontFamily.medium,
        color: Colors.white,
        marginBottom: verticalScale(4),
    },
    productPrice: {
        fontSize: moderateScale(14),
        fontFamily: Theme.fontFamily.bold,
        color: Colors.white,
    },
    promoBanner: {
        height: verticalScale(150),
        marginBottom: verticalScale(25),
        position: 'relative',
    },
    promoImage: {
        width: '100%',
        height: '100%',
    },
    promoOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: moderateScale(20),
        justifyContent: 'center',
    },
    promoLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(10),
    },
    promoLine: {
        width: moderateScale(2),
        height: verticalScale(15),
        backgroundColor: 'rgba(255,255,255,0.4)',
        marginRight: moderateScale(10),
    },
    promoLabel: {
        fontSize: moderateScale(12),
        color: 'rgba(255,255,255,0.6)',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    promoTitle: {
        fontSize: moderateScale(20),
        fontFamily: Theme.fontFamily.bold,
        color: Colors.white,
        lineHeight: moderateScale(26),
    },
    recommendedCard: {
        width: moderateScale(220),
        backgroundColor: '#1C1C1E',
        borderRadius: moderateScale(12),
        marginRight: moderateScale(15),
        padding: moderateScale(10),
    },
    recommendedContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    recommendedImage: {
        width: moderateScale(60),
        height: moderateScale(60),
        borderRadius: moderateScale(8),
    },
    recommendedInfo: {
        marginLeft: moderateScale(12),
        flex: 1,
    },
    recommendedName: {
        fontSize: moderateScale(13),
        fontFamily: Theme.fontFamily.medium,
        color: Colors.white,
        marginBottom: verticalScale(2),
    },
    recommendedPrice: {
        fontSize: moderateScale(14),
        fontFamily: Theme.fontFamily.bold,
        color: Colors.white,
    },
    topCollectionBanner: {
        height: verticalScale(180),
        marginHorizontal: moderateScale(20),
        borderRadius: moderateScale(15),
        overflow: 'hidden',
    },
});

export default HomeScreen;
