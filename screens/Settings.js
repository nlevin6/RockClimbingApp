import React from 'react';
import { View, Text } from 'react-native';
import tw from '../tailwind';

const Settings = () => (
    <View style={tw`flex-1 justify-center items-center bg-slate-900`}>
        <Text style={tw`text-white text-xl`}>Settings Page</Text>
    </View>
);

export default Settings;
