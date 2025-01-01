import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from '../tailwind';
import GradingSystemSelect from './components/GradingSystemSelect';
import ColorPickerComponent from "./components/ColorPickerComponent";
import { useGradingSystem } from './components/GradingContext';
import { signOut } from 'firebase/auth';
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
            </View>
        </View>
    );
};

export default Settings;
