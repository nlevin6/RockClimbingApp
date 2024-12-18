import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLabel } from 'victory-native';
import tw from '../../tailwind';

const BarGraph = () => {
    const [activeView, setActiveView] = useState('Day');
    const [selectedBar, setSelectedBar] = useState(null);

    const data = {
        Day: [
            { day: 'Mon', value: 3 },
            { day: 'Tue', value: 2 },
            { day: 'Wed', value: 5 },
            { day: 'Thu', value: 1 },
            { day: 'Fri', value: 6 },
            { day: 'Sat', value: 2 },
            { day: 'Sun', value: 4 },
        ],
        Month: [
            { day: 'Jan', value: 10 },
            { day: 'Feb', value: 15 },
            { day: 'Mar', value: 25 },
            { day: 'Apr', value: 20 },
            { day: 'May', value: 30 },
            { day: 'Jun', value: 18 },
            { day: 'Jul', value: 18 },
        ],
        Year: [
            { day: '2020', value: 80 },
            { day: '2021', value: 120 },
            { day: '2022', value: 150 },
            { day: '2023', value: 170 },
        ],
    };

    return (
        <View style={tw`flex-1`}>
            <View style={tw`flex-row justify-center mb-2`}>
                {['Day', 'Month', 'Year'].map((view) => (
                    <TouchableOpacity
                        key={view}
                        onPress={() => {
                            setActiveView(view);
                            setSelectedBar(null); // Reset selected bar
                        }}
                        style={tw`px-4 py-2 mx-2 rounded-2xl ${
                            activeView === view ? 'bg-violet-600' : 'bg-gray-700'
                        }`}
                    >
                        <Text style={tw`text-white font-bold`}>{view}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <VictoryChart
                domainPadding={{ x: 20 }}
                padding={{ top: 30, bottom: 50, left: 30, right: 30 }}
                domain={{
                    y: [0, Math.max.apply(null, data[activeView].map((d) => d.value)) + 5],
                }}
            >
                <VictoryAxis
                    style={{
                        axis: { stroke: '#fff', strokeWidth: 2 },
                        tickLabels: { fontSize: 14, fill: '#fff' },
                    }}
                />

                <VictoryBar
                    data={data[activeView]}
                    x="day"
                    y="value"
                    barWidth={30}
                    cornerRadius={{ top: 5 }}
                    style={{
                        data: { fill: 'rgb(167 139 250)' },
                    }}
                    events={[
                        {
                            target: 'data',
                            eventHandlers: {
                                onPress: (_, props) => {
                                    setSelectedBar(props.index);
                                },
                            },
                        },
                    ]}
                    labels={({ index, datum }) =>
                        selectedBar === index ? `${datum.value}` : ''
                    }
                    labelComponent={
                        <VictoryLabel
                            style={{ fontSize: 12, fill: '#fff', opacity: 1 }}
                            dy={-10}
                        />
                    }
                />
            </VictoryChart>
        </View>
    );
};

export default BarGraph;
