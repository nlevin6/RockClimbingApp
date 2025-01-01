import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import app from '../../firebaseConfig';
import tw from '../../tailwind';

const auth = getAuth(app);

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const navigation = useNavigation();

    const handlePasswordReset = () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email.');
            return;
        }

        sendPasswordResetEmail(auth, email)
            .then(() => {
                Alert.alert('Success', 'Password reset link has been sent to your email.');
                navigation.goBack();
            })
            .catch((error) => {
                Alert.alert('Error', 'Failed to send password reset email. Please try again.');
                console.error(error);
            });
    };

    return (
        <View style={tw`flex-1 bg-slate-900 px-4`}>
            <TouchableOpacity
                style={tw`flex-row items-center mt-12 ml-4`}
                onPress={() => navigation.goBack()}
            >
                <Icon name="arrow-back" size={24} color="#7C3AED" />
                <Text style={tw`text-violet-700 text-lg font-bold ml-2`}>Back</Text>
            </TouchableOpacity>
            <View style={tw`flex-1 justify-center items-center`}>
                <Text style={tw`text-3xl font-bold mb-6 text-violet-600`}>Reset Password</Text>
                <TextInput
                    style={tw`w-3/4 p-3 mb-4 border border-slate-700 rounded-2xl bg-slate-900 text-violet-200`}
                    placeholder="Enter your email"
                    placeholderTextColor="#64748B"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <TouchableOpacity
                    style={tw`w-3/4 p-3 mb-4 rounded-2xl bg-violet-800`}
                    onPress={handlePasswordReset}
                >
                    <Text style={tw`text-white text-center font-bold`}>Send Reset Link</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ForgotPassword;
