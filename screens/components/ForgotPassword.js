import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import tw from '../../tailwind';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const handlePasswordReset = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email.');
            return;
        }

        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert('Success', 'Password reset link has been sent to your email.');
            navigation.goBack();
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                Alert.alert('Error', 'The email address is not registered.');
            } else if (error.code === 'auth/invalid-email') {
                Alert.alert('Error', 'The email address is not valid.');
            } else {
                Alert.alert('Error', 'Failed to send password reset email. Please try again.');
            }
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={tw`flex-1 bg-slate-900`}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={tw`flex-grow`}>
                <TouchableOpacity
                    style={tw`flex-row items-center mt-12 ml-4`}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back" size={24} color="#7C3AED" />
                    <Text style={tw`text-violet-700 text-lg font-bold ml-2`}>Back</Text>
                </TouchableOpacity>
                <View style={tw`flex-1 justify-center items-center px-4`}>
                    <Text style={tw`text-3xl font-bold mb-6 text-violet-600`}>Reset Password</Text>
                    <TextInput
                        style={tw`w-3/4 p-3 mb-4 border border-slate-700 rounded-2xl bg-slate-900 text-violet-200`}
                        placeholder="Enter your email"
                        placeholderTextColor="#64748B"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                    {loading ? (
                        <ActivityIndicator size="small" color="#8B5CF6" style={tw`mt-6 mb-4`} />
                    ) : (
                        <TouchableOpacity
                            style={tw`w-3/4 p-3 mb-4 rounded-2xl bg-violet-800`}
                            onPress={handlePasswordReset}
                        >
                            <Text style={tw`text-white text-center font-bold`}>Send Reset Link</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );

};

export default ForgotPassword;
