import React from 'react';
import {View, Text} from 'react-native';
import tw from '../tailwind';
import GradingSystemSelect from './components/GradingSystemSelect';

const Settings = () => {
    return (
        <View style={tw`flex-1 bg-slate-900`}>
            <View style={tw`flex-1 mt-12`}>
                <Text style={tw`text-violet-600 mb-2 ml-4 text-xl font-bold`}>Settings</Text>
                <GradingSystemSelect/>
            </View>
        </View>
    );
};

export default Settings;
