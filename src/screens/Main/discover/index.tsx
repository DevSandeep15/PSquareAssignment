import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    ScrollView,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import Svg, { Path } from 'react-native-svg';
import axios from 'axios';
import { BASE_URL } from '../../../constants/urls';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useAppSelector } from '../../../store/hooks';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - moderateScale(50)) / 2;

const SearchScreen = () => {
    const navigation = useNavigation<any>();
    const { categories } = useAppSelector(state => state.product);

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // Filter States
    const [showFilters, setShowFilters] = useState(false);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [exactPrice, setExactPrice] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    const performSearch = useCallback(async () => {
        setLoading(true);
        try {
            let url = `${BASE_URL}/products`;
            const params = [];

            if (query && query.trim().length > 0) params.push(`title=${encodeURIComponent(query)}`);
            if (exactPrice) params.push(`price=${exactPrice}`);
            if (minPrice) params.push(`price_min=${minPrice}`);
            if (maxPrice) params.push(`price_max=${maxPrice}`);
            if (selectedCategoryId !== null) params.push(`categoryId=${selectedCategoryId}`);

            if (params.length > 0) {
                url += `?${params.join('&')}`;
            }

            const response = await axios.get(url);
            if (Array.isArray(response?.data)) {
                setResults(response?.data);
            } else {
                setResults([]);
            }
        } catch (error: any) {
            console.error('Search error:', error);
            Toast.show({
                type: 'error',
                text1: 'Search Error',
                text2: error.message || 'Failed to find products.',
            });
        } finally {
            setLoading(false);
        }
    }, [query, minPrice, maxPrice, selectedCategoryId]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            performSearch();
        }, 400);
        return () => clearTimeout(timeoutId);
    }, [query, minPrice, maxPrice, exactPrice, selectedCategoryId, performSearch]);

    const resetFilters = () => {
        setMinPrice('');
        setMaxPrice('');
        setExactPrice('');
        setSelectedCategoryId(null);
        setQuery('');
    };

    const renderProduct = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.productCard}
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
        >
            <View style={styles.imageWrapper}>
                <Image
                    source={{ uri: item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/150' }}
                    style={styles.productImage}
                />
            </View>
            <View style={styles.productInfo}>
                <Text style={styles.productTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.productPrice}>$ {item.price}.00</Text>
            </View>
        </TouchableOpacity>
    );

    const hasActiveFilters = query.length > 0 || minPrice !== '' || maxPrice !== '' || exactPrice !== '' || selectedCategoryId !== null;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.searchBar}>
                    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 10 }}>
                        <Path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#999" strokeWidth="2" />
                        <Path d="M21 21L16.65 16.65" stroke="#999" strokeWidth="2" />
                    </Svg>
                    <TextInput
                        style={styles.input}
                        placeholder="Search products..."
                        placeholderTextColor="#999"
                        value={query}
                        onChangeText={setQuery}
                    />
                </View>
                <TouchableOpacity
                    style={[styles.filterBtn, hasActiveFilters ? styles.filterBtnActive : null]}
                    onPress={() => setShowFilters(true)}
                >
                    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <Path d="M4 21V14M4 10V3M12 21V12M12 8V3M20 21V16M20 12V3M2 14H6M10 8H14M18 16H22" stroke={Colors.white} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator color={Colors.white} />
                </View>
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={(item: any) => item.id.toString()}
                    renderItem={renderProduct}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>
                            No products matching your search.
                        </Text>
                    }
                />
            )}

            <Modal
                visible={showFilters}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowFilters(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Filters</Text>
                            <TouchableOpacity onPress={() => setShowFilters(false)}>
                                <Text style={styles.closeText}>Done</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.filterOptions} showsVerticalScrollIndicator={false}>
                            <Text style={styles.filterSectionTitle}>Exact Price</Text>
                            <TextInput
                                style={styles.priceInputSingle}
                                placeholder="Enter exact price (e.g. 100)"
                                placeholderTextColor="#666"
                                keyboardType="numeric"
                                value={exactPrice}
                                onChangeText={setExactPrice}
                            />

                            <Text style={styles.filterSectionTitle}>Price Range</Text>
                            <View style={styles.priceRangeContainer}>
                                <TextInput
                                    style={styles.priceInput}
                                    placeholder="Min"
                                    placeholderTextColor="#666"
                                    keyboardType="numeric"
                                    value={minPrice}
                                    onChangeText={setMinPrice}
                                />
                                <View style={styles.priceDivider} />
                                <TextInput
                                    style={styles.priceInput}
                                    placeholder="Max"
                                    placeholderTextColor="#666"
                                    keyboardType="numeric"
                                    value={maxPrice}
                                    onChangeText={setMaxPrice}
                                />
                            </View>

                            <Text style={styles.filterSectionTitle}>Category</Text>
                            <View style={styles.categoryGrid}>
                                {(categories || []).map((cat: any) => (
                                    <TouchableOpacity
                                        key={cat.id}
                                        style={[
                                            styles.categoryChip,
                                            selectedCategoryId === cat.id ? styles.categoryChipActive : null
                                        ]}
                                        onPress={() => setSelectedCategoryId(selectedCategoryId === cat.id ? null : cat.id)}
                                    >
                                        <Text style={[
                                            styles.categoryChipText,
                                            selectedCategoryId === cat.id ? styles.categoryChipTextActive : null
                                        ]}>
                                            {cat.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>

                        <TouchableOpacity style={styles.resetBtn} onPress={resetFilters}>
                            <Text style={styles.resetText}>Reset All</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        paddingHorizontal: moderateScale(20),
        paddingVertical: verticalScale(15),
        alignItems: 'center',
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        borderRadius: moderateScale(12),
        height: verticalScale(45),
    },
    filterBtn: {
        width: moderateScale(45),
        height: moderateScale(45),
        backgroundColor: '#1C1C1E',
        borderRadius: moderateScale(12),
        marginLeft: moderateScale(10),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    filterBtnActive: {
        backgroundColor: '#333',
        borderColor: Colors.white,
    },
    input: {
        flex: 1,
        color: Colors.white,
        paddingHorizontal: moderateScale(10),
        fontFamily: Theme.fontFamily.medium,
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
    imageWrapper: {
        width: '100%',
        height: verticalScale(180),
        backgroundColor: '#222',
    },
    productImage: {
        width: '100%',
        height: '100%',
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
    emptyText: {
        color: '#666',
        textAlign: 'center',
        marginTop: verticalScale(50),
        fontSize: moderateScale(14),
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#1C1C1E',
        borderTopLeftRadius: moderateScale(25),
        borderTopRightRadius: moderateScale(25),
        height: '70%',
        padding: moderateScale(20),
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(25),
    },
    modalTitle: {
        fontSize: moderateScale(20),
        fontFamily: Theme.fontFamily.bold,
        color: Colors.white,
    },
    closeText: {
        color: Colors.white,
        fontFamily: Theme.fontFamily.bold,
        fontSize: moderateScale(16),
    },
    filterOptions: {
        flex: 1,
    },
    filterSectionTitle: {
        color: Colors.white,
        fontSize: moderateScale(16),
        fontFamily: Theme.fontFamily.bold,
        marginBottom: verticalScale(15),
        marginTop: verticalScale(10),
    },
    priceRangeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(20),
    },
    priceInput: {
        flex: 1,
        backgroundColor: '#2C2C2E',
        borderRadius: moderateScale(10),
        height: verticalScale(45),
        color: Colors.white,
        textAlign: 'center',
    },
    priceInputSingle: {
        backgroundColor: '#2C2C2E',
        borderRadius: moderateScale(10),
        height: verticalScale(45),
        color: Colors.white,
        paddingHorizontal: moderateScale(15),
        marginBottom: verticalScale(10),
    },
    priceDivider: {
        width: moderateScale(15),
        height: 1,
        backgroundColor: '#444',
        marginHorizontal: moderateScale(10),
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: verticalScale(20),
    },
    categoryChip: {
        backgroundColor: '#2C2C2E',
        paddingHorizontal: moderateScale(15),
        paddingVertical: verticalScale(8),
        borderRadius: moderateScale(20),
        marginRight: moderateScale(10),
        marginBottom: moderateScale(10),
    },
    categoryChipActive: {
        backgroundColor: Colors.white,
    },
    categoryChipText: {
        color: '#999',
        fontSize: moderateScale(13),
    },
    categoryChipTextActive: {
        color: Colors.black,
        fontFamily: Theme.fontFamily.bold,
    },
    resetBtn: {
        height: verticalScale(50),
        justifyContent: 'center',
        alignItems: 'center',
    },
    resetText: {
        color: '#FF6B6B',
        fontSize: moderateScale(14),
        fontFamily: Theme.fontFamily.bold,
    }
});

export default SearchScreen;
