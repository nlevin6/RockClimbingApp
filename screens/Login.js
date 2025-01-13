import React, { useState } from 'react';
import {
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Keyboard,
    ActivityIndicator,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import tw from '../tailwind';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    const getCustomErrorMessage = (errorCode) => {
        const errorMessages = {
            'auth/invalid-email': 'The email address is not valid.',
            'auth/user-not-found': 'No account found with this email.',
            'auth/invalid-credential': 'Incorrect password. Please try again.',
            'auth/email-already-in-use': 'This email is already registered.',
            'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
            'auth/missing-password': 'Password is required. Please enter a password.',
        };

        return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
    };

    const handleRegister = () => {
        Keyboard.dismiss();
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        setLoading(true);

        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                return signInWithEmailAndPassword(auth, email, password);
            })
            .then(() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                });
            })
            .catch((error) => {
                const errorMessage = getCustomErrorMessage(error.code);
                Alert.alert('Error', errorMessage);
            })
            .finally(() => setLoading(false));
    };

    const handleLogin = () => {
        Keyboard.dismiss();
        setLoading(true);

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                });
            })
            .catch((error) => {
                const errorMessage = getCustomErrorMessage(error.code);
                Alert.alert('Login Failed', errorMessage);
            })
            .finally(() => setLoading(false));
    };

    return (
        <KeyboardAvoidingView
            style={tw`flex-1 bg-slate-900`}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={tw`flex-grow justify-center items-center px-4`}>
                <Text style={tw`text-3xl font-bold mb-6 text-violet-600`}>
                    {isRegistering ? 'Register' : 'Login'}
                </Text>
                <TextInput
                    style={tw`w-3/4 p-3 mb-4 border border-slate-700 rounded-2xl bg-slate-900 text-violet-200`}
                    placeholder="Email"
                    placeholderTextColor="#64748B"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <TextInput
                    style={tw`w-3/4 p-3 mb-4 border border-slate-700 rounded-2xl bg-slate-900 text-violet-200`}
                    placeholder="Password"
                    placeholderTextColor="#64748B"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                {isRegistering && (
                    <TextInput
                        style={tw`w-3/4 p-3 mb-6 border border-slate-700 rounded-2xl bg-slate-900 text-violet-200`}
                        placeholder="Confirm Password"
                        placeholderTextColor="#64748B"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />
                )}
                {isRegistering && (
                    <Text style={tw`w-3/4 p-1 text-xs mb-6 text-slate-500 text-center`}>
                        {'Password must be at least 6 characters long'}
                    </Text>
                )}

                {loading ? (
                    <ActivityIndicator size="small" color="#8B5CF6" style={tw`mt-6 mb-4`} />
                ) : (
                    <TouchableOpacity
                        style={tw`w-3/4 p-3 mb-4 rounded-2xl bg-violet-800`}
                        onPress={isRegistering ? handleRegister : handleLogin}
                    >
                        <Text style={tw`text-white text-center font-bold`}>
                            {isRegistering ? 'Register' : 'Login'}
                        </Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
                    <Text style={tw`text-violet-300`}>
                        {isRegistering ? 'Already have an account? Log in' : 'Don\'t have an account? Register'}
                    </Text>
                </TouchableOpacity>
                {!isRegistering && (
                    <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                        <Text style={tw`text-violet-300 mb-6 mt-6`}>Forgot Password?</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Login;
