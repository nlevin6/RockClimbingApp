import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLabel } from 'victory-native';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import tw from '../../tailwind';
import app from '../../firebaseConfig';

const db = getFirestore(app);

const BarGraph = () => {
    const [activeView, setActiveView] = useState('Day');
    const [climbData, setClimbData] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'climbs'), (snapshot) => {
            const data = snapshot.docs.map((doc) => doc.data());
            processClimbData(data);
        });
        return () => unsubscribe();
    }, [activeView]);

    const processClimbData = (data) => {
        const today = new Date();
        let aggregatedData;

        if (activeView === 'Day') {
            const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);

            const dayCounts = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
            data.forEach((climb) => {
                const climbDate = new Date(climb.date);
                if (climbDate >= startOfWeek && climbDate <= endOfWeek) {
                    const day = climbDate.getDay();
                    const dayMapping = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    dayCounts[dayMapping[day]] += 1;
                }
            });
            aggregatedData = Object.keys(dayCounts).map((key) => ({ day: key, value: dayCounts[key] }));
        } else if (activeView === 'Month') {
            const currentYear = today.getFullYear();
            const monthCounts = Array(12).fill(0);

            data.forEach((climb) => {
                const climbDate = new Date(climb.date);
                if (climbDate.getFullYear() === currentYear) {
                    const month = climbDate.getMonth();
                    monthCounts[month] += 1;
                }
            });

            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            aggregatedData = monthCounts.map((value, index) => ({ day: monthNames[index], value }));
        } else if (activeView === 'Year') {
            const yearCounts = {};
            data.forEach((climb) => {
                const year = new Date(climb.date).getFullYear();
                yearCounts[year] = (yearCounts[year] || 0) + 1;
            });
            aggregatedData = Object.keys(yearCounts).map((key) => ({ day: key, value: yearCounts[key] }));
        }

        setClimbData(aggregatedData);
    };

    return (
        <View style={tw`flex-1`}>
            <View style={tw`flex-row justify-center mb-2`}>
                {['Day', 'Month', 'Year'].map((view) => (
                    <TouchableOpacity
                        key={view}
                        onPress={() => setActiveView(view)}
                        style={tw`px-4 py-2 mx-2 rounded-2xl ${
                            activeView === view ? 'bg-violet-600' : 'bg-gray-700'
                        }`}
                    >
                        <Text style={tw`text-white font-bold`}>{view}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <VictoryChart domainPadding={{ x: 20 }}>
                <VictoryAxis
                    style={{
                        axis: { stroke: '#fff', strokeWidth: 2 },
                        tickLabels: { fontSize: 14, fill: '#fff' },
                    }}
                />
                <VictoryBar
                    data={climbData}
                    x="day"
                    y="value"
                    barWidth={30}
                    cornerRadius={{ top: 5 }}
                    style={{
                        data: { fill: 'rgb(124, 58, 237)' },
                    }}
                    labels={({ datum }) => `${datum.value}`}
                    labelComponent={<VictoryLabel dy={-10} style={{ fill: 'white' }} />}
                />
            </VictoryChart>
        </View>
    );
};

export default BarGraph;
