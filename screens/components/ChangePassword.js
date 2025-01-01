import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import tw from '../../tailwind';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider, signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigation = useNavigation();

    const handleChangePassword = () => {
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New password and confirmation do not match.');
            return;
        }

        const user = auth.currentUser;

        if (user) {
            const credential = EmailAuthProvider.credential(user.email, currentPassword);

            reauthenticateWithCredential(user, credential)
                .then(() => updatePassword(user, newPassword))
                .then(() => {
                    Alert.alert('Success', 'Your password has been updated. Please log in again.');
                    return signOut(auth);
                })
                .then(() => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                    });
                })
                .catch((error) => {
                    if (error.code === 'auth/invalid-credential') {
                        Alert.alert('Error', 'Invalid credentials. Please try again.');
                    } else {
                        Alert.alert('Error', 'Failed to update password. Please try again.');
                    }
                });
        } else {
            Alert.alert('Error', 'User is not authenticated.');
        }
    };

    return (
        <KeyboardAvoidingView
            style={tw`flex-1 bg-slate-900`}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjusts behavior based on platform
        >
            <ScrollView contentContainerStyle={tw`flex-grow justify-center items-center px-4`}>
                <TouchableOpacity
                    style={tw`flex-row items-center absolute top-12 left-4`}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back" size={24} color="#7C3AED" />
                    <Text style={tw`text-violet-700 text-lg font-bold ml-2`}>Back</Text>
                </TouchableOpacity>
                <Text style={tw`text-3xl font-bold mb-6 text-violet-600 text-center`}>Change Password</Text>
                <TextInput
                    style={tw`w-3/4 p-3 mb-4 border border-slate-700 rounded-2xl bg-slate-900 text-violet-200`}
                    placeholder="Current Password"
                    placeholderTextColor="#64748B"
                    secureTextEntry
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                />
                <TextInput
                    style={tw`w-3/4 p-3 mb-4 border border-slate-700 rounded-2xl bg-slate-900 text-violet-200`}
                    placeholder="New Password"
                    placeholderTextColor="#64748B"
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                />
                <TextInput
                    style={tw`w-3/4 p-3 mb-1 border border-slate-700 rounded-2xl bg-slate-900 text-violet-200`}
                    placeholder="Confirm New Password"
                    placeholderTextColor="#64748B"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
                <Text style={tw`w-3/4 p-1 text-xs mb-6 text-slate-500 text-center`}>
                    {'Password must be at least 6 characters long'}
                </Text>
                <TouchableOpacity
                    style={tw`w-3/4 p-3 mb-4 rounded-2xl bg-violet-800`}
                    onPress={handleChangePassword}
                >
                    <Text style={tw`text-white text-center font-bold`}>Update Password</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default ChangePassword;
