import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import auth from '@react-native-firebase/auth';
import { useAppSelector } from '../../../store/hooks';

const ProfileScreen = () => {
    const user = useAppSelector(state => state.auth.user);

    const handleLogout = () => {
        auth().signOut();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </Text>
                </View>
                <Text style={styles.name}>{user?.displayName || 'User'}</Text>
                <Text style={styles.email}>{user?.email}</Text>

                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Log Out</Text>
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
    content: {
        flex: 1,
        alignItems: 'center',
        paddingTop: verticalScale(50),
    },
    avatar: {
        width: moderateScale(100),
        height: moderateScale(100),
        borderRadius: moderateScale(50),
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(20),
    },
    avatarText: {
        color: Colors.white,
        fontSize: moderateScale(40),
        fontFamily: Theme.fontFamily.bold,
    },
    name: {
        color: Colors.white,
        fontSize: moderateScale(24),
        fontFamily: Theme.fontFamily.bold,
        marginBottom: verticalScale(5),
    },
    email: {
        color: '#999',
        fontSize: moderateScale(16),
        fontFamily: Theme.fontFamily.regular,
        marginBottom: verticalScale(40),
    },
    logoutBtn: {
        width: '80%',
        height: verticalScale(50),
        backgroundColor: '#FF3B30',
        borderRadius: moderateScale(25),
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutText: {
        color: Colors.white,
        fontSize: moderateScale(16),
        fontFamily: Theme.fontFamily.bold,
    },
});

export default ProfileScreen;
