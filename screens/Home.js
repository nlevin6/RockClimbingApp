import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import BarGraph from './components/BarGraph';
import tw from '../tailwind';
import ClimbingStats from "./components/ClimbingStats";

const Home = () => {
    return (
        <ScrollView style={tw`flex-1 bg-slate-900`}>
            <View style={tw`flex-1`}>
                <View style={tw`mt-12 mb-8 justify-center text-center`}>
                    <BarGraph />
                </View>

                <View style={tw`bg-gray-800 p-4 rounded-t-3xl`}>
                    <Text style={tw`text-white text-xl font-bold mb-2`}>Climbing Stats</Text>
                    <View style={tw`border-t border-gray-600 my-2`} />
                    <ClimbingStats />
                    <Text style={tw`text-gray-400 text-sm`}>
                        Placeholder for climbing statistics categories.
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};

export default Home;
