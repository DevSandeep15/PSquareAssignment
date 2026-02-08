import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator
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

const SearchScreen = () => {
    const navigation = useNavigation<any>();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (query.length > 2) {
            const searchProducts = async () => {
                setLoading(true);
                try {
                    const response = await axios.get(`${BASE_URL}/products?title=${query}`);
                    setResults(response.data);
                } catch (error) {
                    console.error(error);
                    Toast.show({
                        type: 'error',
                        text1: 'Search Error',
                        text2: 'Failed to find products. Please try again.',
                    });
                } finally {
                    setLoading(false);
                }
            };
            const timeoutId = setTimeout(searchProducts, 500);
            return () => clearTimeout(timeoutId);
        } else {
            setResults([]);
        }
    }, [query]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchContainer}>
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
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator color={Colors.white} />
                </View>
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={(item: any) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.resultItem}
                            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
                        >
                            <Image source={{ uri: item.images[0] }} style={styles.thumb} />
                            <View style={styles.info}>
                                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                                <Text style={styles.price}>$ {item.price}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        query.length > 2 ? (
                            <Text style={styles.emptyText}>No products found</Text>
                        ) : (
                            <Text style={styles.emptyText}>Start typing to search...</Text>
                        )
                    }
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
    searchContainer: {
        padding: moderateScale(20),
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        borderRadius: moderateScale(12),
        height: verticalScale(45),
    },
    input: {
        flex: 1,
        color: Colors.white,
        paddingHorizontal: moderateScale(10),
        fontFamily: Theme.fontFamily.medium,
    },
    list: {
        paddingHorizontal: moderateScale(20),
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#111',
        borderRadius: moderateScale(10),
        padding: moderateScale(10),
        marginBottom: verticalScale(10),
    },
    thumb: {
        width: moderateScale(50),
        height: moderateScale(50),
        borderRadius: moderateScale(5),
    },
    info: {
        flex: 1,
        marginLeft: moderateScale(15),
    },
    title: {
        color: Colors.white,
        fontFamily: Theme.fontFamily.medium,
        fontSize: moderateScale(14),
    },
    price: {
        color: '#999',
        fontSize: moderateScale(12),
        marginTop: verticalScale(2),
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
    }
});

export default SearchScreen;
