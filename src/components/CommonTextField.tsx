import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ViewStyle,
    TextStyle,
    TextInputProps,
    TouchableOpacity,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Theme } from '../constants/theme';
import { moderateScale, verticalScale } from 'react-native-size-matters';

interface CommonTextFieldProps extends TextInputProps {
    label?: string;
    error?: string;
    touched?: boolean;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
    isPassword?: boolean;
}

const CommonTextField: React.FC<CommonTextFieldProps> = ({
    label,
    value,
    placeholder,
    onChangeText,
    isPassword,
    error,
    touched,
    containerStyle,
    inputStyle,
    onFocus,
    onBlur,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const showError = error && touched;

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View
                style={[
                    styles.inputWrapper,
                    {
                        borderBottomColor: showError
                            ? 'red'
                            : isFocused
                                ? Colors.primary
                                : Colors.textSecondary,
                    },
                ]}>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={Colors.textSecondary}
                    secureTextEntry={isPassword ? !showPassword : props.secureTextEntry}
                    style={[styles.input, inputStyle]}
                    onFocus={(e) => {
                        setIsFocused(true);
                        onFocus && onFocus(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        onBlur && onBlur(e);
                    }}
                    autoCapitalize="none"
                    {...props}
                />
                {isPassword && (
                    <TouchableOpacity
                        onPress={togglePasswordVisibility}
                        activeOpacity={0.7}
                        style={styles.eyeBtn}>
                        <Text style={styles.eyeText}>{showPassword ? 'Hide' : 'Show'}</Text>
                    </TouchableOpacity>
                )}
            </View>
            {showError && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: verticalScale(20),
        width: '100%',
    },
    label: {
        fontSize: moderateScale(14),
        fontFamily: Theme.fontFamily.medium,
        color: Colors.textSecondary,
        marginBottom: verticalScale(4),
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        height: verticalScale(40),
    },
    input: {
        flex: 1,
        fontSize: moderateScale(14),
        fontFamily: Theme.fontFamily.regular,
        color: Colors.text,
        padding: 0,
    },
    eyeBtn: {
        paddingLeft: moderateScale(10),
    },
    eyeText: {
        color: Colors.textSecondary,
        fontSize: moderateScale(12),
        fontFamily: Theme.fontFamily.semiBold,
    },
    errorText: {
        color: 'red',
        fontSize: moderateScale(12),
        fontFamily: Theme.fontFamily.regular,
        marginTop: verticalScale(5),
    },
});

export default CommonTextField;
