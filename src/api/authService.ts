import auth from '@react-native-firebase/auth';

export const signIn = async (email: string, password: string) => {
    try {
        const userCredential = await auth().signInWithEmailAndPassword(email, password);
        return userCredential.user;
    } catch (error: any) {
        throw error;
    }
};

export const signUp = async (email: string, password: string) => {
    try {
        const userCredential = await auth().createUserWithEmailAndPassword(email, password);
        return userCredential.user;
    } catch (error: any) {
        throw error;
    }
};

export const signOut = async () => {
    try {
        await auth().signOut();
    } catch (error: any) {
        throw error;
    }
};

export const onAuthStateChanged = (callback: (user: any) => void) => {
    return auth().onAuthStateChanged(callback);
};
