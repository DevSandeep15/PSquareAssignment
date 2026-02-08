import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';
import { Theme } from '../constants/theme';
import { moderateScale, verticalScale } from 'react-native-size-matters';

interface CommonHeaderProps {
    title: string;
    subtitle?: string;
    onBack?: () => void;
    showBack?: boolean;
}

const CommonHeader: React.FC<CommonHeaderProps> = ({
    title,
    subtitle,
    onBack,
    showBack = false,
}) => {
    return (
        <View style={styles.container}>
            {showBack && (
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    {/* You can add an icon here */}
                    <Text style={styles.backText}>{'<'}</Text>
                </TouchableOpacity>
            )}
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: verticalScale(40),
        marginBottom: verticalScale(20),
    },
    backButton: {
        marginBottom: verticalScale(20),
    },
    backText: {
        color: Colors.white,
        fontSize: moderateScale(24),
    },
    title: {
        fontSize: moderateScale(30),
        fontFamily: Theme.fontFamily.bold,
        color: Colors.white,
        lineHeight: moderateScale(40),
    },
    subtitle: {
        fontSize: moderateScale(30),
        fontFamily: Theme.fontFamily.bold,
        color: Colors.white,
        lineHeight: moderateScale(40),
        marginTop: verticalScale(5),
    },
});

export default CommonHeader;
