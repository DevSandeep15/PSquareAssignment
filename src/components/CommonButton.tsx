import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
    ActivityIndicator,
    View,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Theme } from '../constants/theme';
import { moderateScale, verticalScale } from 'react-native-size-matters';

interface CommonButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    icon?: React.ReactNode;
}

const CommonButton: React.FC<CommonButtonProps> = ({
    title,
    onPress,
    loading,
    disabled,
    style,
    textStyle,
    icon,
}) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                styles.button,
                style,
                (disabled || loading) && styles.disabled,
            ]}>
            {loading ? (
                <ActivityIndicator color={Colors.black} />
            ) : (
                <View style={styles.contentContainer}>
                    <Text style={[styles.text, textStyle]}>{title}</Text>
                    {icon && <View style={styles.iconContainer}>{icon}</View>}
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: verticalScale(42),
        borderRadius: moderateScale(25),
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: Colors.white,
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: moderateScale(15),
        fontFamily: Theme.fontFamily.bold,
        color: Colors.black,
    },
    disabled: {
        opacity: 0.6,
    },
    iconContainer: {
        marginLeft: moderateScale(10),
    },
});

export default CommonButton;
