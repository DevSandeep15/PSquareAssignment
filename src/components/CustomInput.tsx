import React from 'react';
import { View, TextInput, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing } from '../theme/Theme';

interface CustomInputProps {
    label?: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    error?: string;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    style?: ViewStyle;
}

const CustomInput: React.FC<CustomInputProps> = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    error,
    keyboardType = 'default',
    style,
}) => {
    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[styles.input, error ? styles.inputError : null]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={Colors.gray}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                autoCapitalize="none"
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: Spacing.sm,
        width: '100%',
    },
    label: {
        fontSize: 14,
        color: Colors.dark,
        marginBottom: Spacing.xs,
        fontWeight: '500',
    },
    input: {
        height: 50,
        backgroundColor: Colors.light,
        borderRadius: 12,
        paddingHorizontal: Spacing.md,
        fontSize: 16,
        color: Colors.dark,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    inputError: {
        borderColor: Colors.danger,
        backgroundColor: '#FFF5F5',
    },
    errorText: {
        fontSize: 12,
        color: Colors.danger,
        marginTop: Spacing.xs,
    },
});

export default CustomInput;
