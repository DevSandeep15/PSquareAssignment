// Placeholder file for utility functions
// Add your helper functions here

export const formatDate = (date: Date): string => {
    return date.toLocaleDateString();
};

export const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getFirebaseErrorMessage = (error: any): string => {
    if (error.message) {
        // Firebase messages usually look like: [auth/user-not-found] User not found.
        // This regex removes the [code] part and any leading space.
        return error.message.replace(/\[.*\]\s*/, '');
    }
    return 'An unknown error occurred';
};
