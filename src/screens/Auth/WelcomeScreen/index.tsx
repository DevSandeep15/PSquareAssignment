import React from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import CommonButton from '../../../components/CommonButton';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { IMAGES } from '../../../constants/images';

const WelcomeScreen = () => {
    const navigation = useNavigation<any>();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    source={IMAGES.splash}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.footer}>
                <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.button}>
                    <Text style={styles.arrowText}>Get Started</Text>
                    <Image source={IMAGES.rightArrow} resizeMode='contain' style={styles.arrowImage} />
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
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: '95%',
    },
    footer: {
        paddingBottom: verticalScale(30),
    },
    button: {
        width: '100%',
        height: moderateScale(50),
        borderRadius: moderateScale(30),
        backgroundColor: Colors.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: moderateScale(20),
    },
    arrowText: {
        fontSize: moderateScale(15),
        color: Colors.black,
        fontFamily: Theme.fontFamily.medium,
    },
    arrowImage: {
        width: moderateScale(18),
        height: moderateScale(18),
    }
});

export default WelcomeScreen;
