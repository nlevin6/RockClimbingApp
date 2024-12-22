import React from 'react';
import { View, Text } from 'react-native';
import ClimbForm from './components/ClimbForm';
import DeleteClimb from './components/DeleteClimb';
import tw from '../tailwind';

const ManageClimbs = ({ navigation }) => {
    return (
        <View style={tw`flex-1 bg-slate-900`}>
            <View style={tw`flex-1 mt-12`}>
                <ClimbForm navigation={navigation} />
                <DeleteClimb />
            </View>
        </View>
    );
};

export default ManageClimbs;
