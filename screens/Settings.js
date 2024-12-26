import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useGradingSystem } from './components/GradingContext';
import tw from '../tailwind';

const Settings = () => {
    const { gradingSystem, toggleGradingSystem } = useGradingSystem();

    return (
        <View style={tw`flex-1 justify-center items-center bg-slate-900`}>
            <Text style={tw`text-white text-xl mb-4`}>Current Grading System:</Text>
            <Text style={tw`text-violet-500 text-2xl mb-6 font-bold`}>{gradingSystem}</Text>
            <TouchableOpacity
                onPress={toggleGradingSystem}
                style={tw`bg-violet-600 px-6 py-3 rounded-xl`}
            >
                <Text style={tw`text-white text-lg`}>Switch Grading System</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Settings;
