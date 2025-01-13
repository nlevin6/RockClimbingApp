import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import tw from '../tailwind';
import GradingSystemSelect from './components/GradingSystemSelect';
import ColorPickerComponent from "./components/ColorPickerComponent";
import { useGradingSystem } from './components/GradingContext';
import { signOut, deleteUser } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import the icon library

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
                    style={tw`bg-violet-500 bg-opacity-30 py-2 rounded-3xl flex-row items-center justify-start pl-4 mb-2`}
                    onPress={() => navigation.navigate('ChangePassword')}
                >
                    <Icon name="lock-reset" size={20} color="rgb(139, 92, 246)" style={tw`mr-2`} />
                    <Text style={tw`text-white text-lg font-semibold`}>Change Password</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={tw`bg-violet-500 bg-opacity-30 py-2 rounded-3xl flex-row items-center justify-start pl-4 mb-2`}
                    onPress={handleLogout}
                >
                    <Icon name="logout" size={20} color="rgb(139, 92, 246)" style={tw`mr-2`} />
                    <Text style={tw`text-white text-lg font-semibold`}>Sign Out</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={tw`py-3 items-center`}
                    onPress={handleDeleteAccount}
                >
                    <Text style={tw`text-red-500 text-sm font-bold`}>Delete Account</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Settings;
