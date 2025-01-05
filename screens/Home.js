import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import BarGraph from './components/BarGraph';
import ClimbingStats from './components/ClimbingStats';
import DetailedStats from './components/DetailedStats';
import tw from '../tailwind';

const Home = () => {
    const [selectedBar, setSelectedBar] = useState(null);

    const handleBarSelect = (barData) => {
        setSelectedBar(barData);
    };

    return (
        <ScrollView style={tw`flex-1 bg-slate-900`}>
            <View style={tw`flex-1`}>
                <View style={tw`mt-12 justify-center text-center`}>
                    <BarGraph onBarSelect={handleBarSelect} />
                </View>
                <Text style={tw`-3/4 p-1 text-xs mb-6 text-slate-500 text-center`}>
                    {'Tap on a bar to view detailed stats'}
                </Text>

                <View style={tw`bg-gray-800 p-4 rounded-t-3xl`}>
                    <Text style={tw`text-violet-500 text-2xl font-bold mb-2`}>Climbing Stats</Text>
                    <View style={tw`border-t border-gray-600 my-2`} />

                    <ClimbingStats />
                    <View style={tw`border-t border-gray-600 my-2`} />
                    {selectedBar && (
                        <DetailedStats
                            activeView={selectedBar.view}
                            label={selectedBar.label}
                        />
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

export default Home;
