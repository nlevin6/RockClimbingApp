import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import BarGraph from './components/BarGraph';
import tw from '../tailwind';

const Home = () => {
    return (
        <View style={tw`flex-1 bg-slate-900 justify-center items-center`}>
            {/* BarGraph is centered */}
            <View style={tw`relative w-full`}>
                <BarGraph />
                <TouchableOpacity style={tw`absolute top-2 right-2 bg-gray-300 p-2 rounded`}>
                    <Text style={tw`text-xs font-bold`}>Weekly/Monthly/Yearly</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Home;
