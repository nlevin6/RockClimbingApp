import React from 'react';
import { View, Text } from 'react-native';
import ClimbForm from './components/ClimbForm';
import DeleteClimb from './components/DeleteClimb';
import tw from '../tailwind';

const ManageClimbs = ({ navigation }) => {
    return (
        <View style={tw`flex-1 bg-slate-900`}>
            <Text style={tw`text-violet-600 text-2xl font-bold ml-4 mt-12`}>Manage Climbs</Text>
            <View style={tw`flex-1`}>
                <ClimbForm navigation={navigation} />
                <DeleteClimb />
            </View>
        </View>
    );
};

export default ManageClimbs;
