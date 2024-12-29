import React from 'react';
import {View, Text} from 'react-native';
import tw from '../tailwind';
import GradingSystemSelect from './components/GradingSystemSelect';
import ColorPickerComponent from "./components/ColorPickerComponent";
import { useGradingSystem } from './components/GradingContext';

const Settings = () => {
    const { gradingSystem } = useGradingSystem();

    return (
        <View style={tw`flex-1 bg-slate-900`}>
            <View style={tw`flex-1 mt-16`}>
                <Text style={tw`text-violet-600 text-xl ml-4 font-bold mb-2`}>Settings</Text>
                <GradingSystemSelect />
                {gradingSystem === 'Chromatic' && (
                    <ColorPickerComponent />
                )}
            </View>
        </View>
    );
};

export default Settings;
