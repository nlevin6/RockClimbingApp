import React from 'react';
import { View, Text } from 'react-native';
import ClimbForm from './components/ClimbForm';
import tw from '../tailwind';

const ManageClimbs = ({ navigation }) => {
    return (
        <View style={tw`flex-1 bg-slate-900`}>
            <Text style={tw`text-white text-2xl font-bold m-4`}>Manage Climbs</Text>
            <ClimbForm navigation={navigation} />
        </View>
    );
};

export default ManageClimbs;
