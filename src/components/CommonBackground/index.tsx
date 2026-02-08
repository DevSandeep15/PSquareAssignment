import React from 'react';
import {
    View,
    StyleSheet,
    StatusBar,
    ViewStyle,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CommonBackgroundProps {
    children: React.ReactNode;
    style?: ViewStyle;
    showStatusBar?: boolean;
}

const CommonBackground: React.FC<CommonBackgroundProps> = ({
    children,
    style,
    showStatusBar = true
}) => {
    return (
        <View style={styles.outerContainer}>
            {showStatusBar && (
                <StatusBar
                    barStyle="light-content"
                    backgroundColor="transparent"
                    translucent
                />
            )}
            <View style={[styles.container, style]}>
                <SafeAreaView style={styles.safeArea}>
                    {children}
                </SafeAreaView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
});

export default CommonBackground;
