import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import tw from '../tailwind';
import GradingSystemSelect from './components/GradingSystemSelect';
import ColorPickerComponent from "./components/ColorPickerComponent";
import { useGradingSystem } from './components/GradingContext';
import { signOut, deleteUser } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const Settings = () => {
    const { gradingSystem } = useGradingSystem();
    const navigation = useNavigation();

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to delete your account? This action is irreversible, and all data will be permanently deleted.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Confirm',
                    style: 'destructive',
                    onPress: () => {
                        const user = auth.currentUser;
                        if (user) {
                            deleteUser(user)
                                .then(() => {
                                    Alert.alert('Account Deleted', 'Your account has been successfully deleted.');
                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: 'Login' }],
                                    });
                                })
                                .catch((error) => {
                                    console.error('Failed to delete account:', error);
                                    if (error.code === 'auth/requires-recent-login') {
                                        Alert.alert(
                                            'Authentication Required',
                                            'Please log in again to confirm your identity before deleting the account.'
                                        );
                                        handleLogout();
                                    } else {
                                        Alert.alert('Error', 'Failed to delete account. Please try again.');
                                    }
                                });
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={tw`flex-1 bg-slate-900`}>
            <View style={tw`flex-1 mt-16`}>
                <Text style={tw`text-violet-600 text-xl ml-4 font-bold mb-2`}>Settings</Text>
                <GradingSystemSelect />
                {gradingSystem === 'Chromatic' && (
                    <ColorPickerComponent />
                )}
            </View>
            <View style={tw`p-4 space-y-4`}>
                <TouchableOpacity
                    style={tw`bg-violet-600 bg-opacity-30 py-3 rounded-3xl items-center border border-violet-600 mb-2`}
                    onPress={() => navigation.navigate('ChangePassword')}
                >
                    <Text style={tw`text-violet-600 text-lg font-bold`}>Change Password</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={tw`bg-red-500 bg-opacity-30 py-3 rounded-3xl border border-red-600 items-center mb-2`}
                    onPress={handleLogout}
                >
                    <Text style={tw`text-red-600 text-lg font-bold`}>Logout</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={tw`bg-red-700 bg-opacity-30 py-3 rounded-3xl border border-red-700 items-center`}
                    onPress={handleDeleteAccount}
                >
                    <Text style={tw`text-red-700 text-lg font-bold`}>Delete Account</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Settings;
