import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useGradingSystem } from './components/GradingContext';
import tw from '../tailwind';

const Settings = () => {
    const { gradingSystem, toggleGradingSystem } = useGradingSystem();

    return (
        <View style={tw`flex-1 justify-center items-center bg-slate-900`}>
            <Text style={tw`text-white text-xl font-bold mb-4`}>Settings</Text>
            <Text style={tw`text-violet-200 text-lg mb-2`}>Current Grading System: {gradingSystem}</Text>
            <TouchableOpacity
                onPress={toggleGradingSystem}
                style={tw`bg-violet-600 p-3 rounded-2xl`}
            >
                <Text style={tw`text-white font-bold text-center`}>Switch to {gradingSystem === 'Hueco (USA)' ? 'Fontainebleau' : 'Hueco (USA)'}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Settings;
