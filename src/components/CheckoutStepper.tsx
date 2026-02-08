import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../constants/colors';
import { IMAGES } from '../constants/images';

interface CheckoutStepperProps {
    currentStep: number; // 1, 2, 3
}

const CheckoutStepper: React.FC<CheckoutStepperProps> = ({ currentStep }) => {

    const renderDots = (isActive: boolean) => {
        return (
            <View style={styles.dotsContainer}>
                {[1, 2, 3, 4, 5].map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            { backgroundColor: isActive ? Colors.white : '#444' } // Active logic can be tweaked if needed
                        ]}
                    />
                ))}
            </View>
        );
    };

    const renderStepIcon = (step: number, icon: any) => {
        const isActive = currentStep >= step;

        return (
            <View style={[styles.stepIconContainer, isActive && styles.activeStepIconContainer]}>
                <Image
                    source={icon}
                    style={[
                        styles.stepIcon,
                        { tintColor: isActive ? Colors.white : '#666' }
                    ]}
                />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Step 1: Shipping (Location/Home) */}
            {renderStepIcon(1, IMAGES.locationIcon)}

            {/* Dots */}
            {renderDots(currentStep >= 2)}

            {/* Step 2: Payment (Card) */}
            {renderStepIcon(2, IMAGES.cardIcon)}

            {/* Dots */}
            {renderDots(currentStep >= 3)}

            {/* Step 3: Success (Check) */}
            {renderStepIcon(3, IMAGES.check)}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(30),
    },
    stepIconContainer: {
        width: moderateScale(30),
        height: moderateScale(30),
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeStepIconContainer: {
    },
    stepIcon: {
        width: moderateScale(20),
        height: moderateScale(20),
        resizeMode: 'contain',
    },
    dotsContainer: {
        flexDirection: 'row',
        marginHorizontal: moderateScale(10),
    },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: '#444',
        marginHorizontal: 3,
    },
});

export default CheckoutStepper;
