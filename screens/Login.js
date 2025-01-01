import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import app from '../firebaseConfig';
import tw from '../tailwind';

const auth = getAuth(app);

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

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
        createUserWithEmailAndPassword(auth, email, password)
            .then(() => alert('User registered successfully!'))
            .catch((error) => {
                const errorMessage = getCustomErrorMessage(error.code);
                alert(errorMessage);
            });
    };

    const handleLogin = () => {
        Keyboard.dismiss();
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                navigation.navigate('Home');
            })
            .catch((error) => {
                const errorMessage = getCustomErrorMessage(error.code);
                Alert.alert('Login Failed', errorMessage);
            });
    };


    return (
        <View style={tw`flex-1 justify-center items-center bg-slate-900 px-4`}>
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
                style={tw`w-3/4 p-3 mb-1 border border-slate-700 rounded-2xl bg-slate-900 text-violet-200`}
                placeholder="Password"
                placeholderTextColor="#64748B"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Text style={tw`w-3/4 p-1 text-xs mb-6 text-slate-500 text-center`}>
                {'Password must be at least 6 characters long'}
            </Text>
            <TouchableOpacity
                style={tw`w-3/4 p-3 mb-4 rounded-2xl bg-violet-800`}
                onPress={isRegistering ? handleRegister : handleLogin}
            >
                <Text style={tw`text-white text-center font-bold`}>
                    {isRegistering ? 'Register' : 'Login'}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
                <Text style={tw`text-violet-300`}>
                    {isRegistering ? 'Already have an account? Log in' : 'Don\'t have an account? Register'}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={tw`text-violet-300 mb-6 mt-6`}>Forgot Password?</Text>
            </TouchableOpacity>

        </View>
    );
};

export default Login;
