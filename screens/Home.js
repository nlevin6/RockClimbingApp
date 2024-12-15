import React from 'react';
import { View, Text } from 'react-native';
import tw from '../tailwind';

const Home = () => {
    return (
        <View style={tw`flex-1 justify-center items-center bg-gray-100`}>
            <Text style={tw`text-2xl font-bold text-gray-800`}>
                Welcome to the Rock Climbing App!
            </Text>
        </View>
    );
};

export default Home;
