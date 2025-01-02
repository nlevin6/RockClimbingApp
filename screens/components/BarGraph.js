import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLabel } from 'victory-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import tw from '../../tailwind';

const BarGraph = ({ onBarSelect }) => {
    const [activeView, setActiveView] = useState('Week');
    const [climbData, setClimbData] = useState([]);
    const [graphKey, setGraphKey] = useState(0);

    useEffect(() => {
        const user = auth.currentUser;

        if (!user) {
            Alert.alert('Error', 'No user logged in. Please log in to view your climbs.');
            return;
        }

        const userClimbsRef = collection(db, `users/${user.uid}/climbs`);

        const unsubscribe = onSnapshot(
            userClimbsRef,
            (snapshot) => {
                const data = snapshot.docs.map((doc) => doc.data());
                processClimbData(data);
            },
            () => {
                Alert.alert('Error', 'Failed to fetch climbs. Please try again later.');
            }
        );

        return () => unsubscribe();
    }, [activeView]);

    const processClimbData = (data) => {
        const today = new Date();
        let aggregatedData;

        if (activeView === 'Week') {
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
            startOfWeek.setHours(0, 0, 0, 0);

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);

            const dayCounts = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };

            data.forEach((climb) => {
                if (!climb.date) {
                    return;
                }
                const climbDate = new Date(climb.date);
                if (isNaN(climbDate)) {
                    return;
                }
                if (climbDate >= startOfWeek && climbDate <= endOfWeek) {
                    const day = climbDate.getDay();
                    const dayMapping = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    dayCounts[dayMapping[day]] += 1;
                }
            });

            aggregatedData = Object.keys(dayCounts).map((key) => ({
                day: key,
                value: dayCounts[key],
            }));
        } else if (activeView === 'Month') {
            const currentYear = today.getFullYear();
            const monthCounts = Array(12).fill(0);

            data.forEach((climb) => {
                if (!climb.date) {
                    return;
                }
                const climbDate = new Date(climb.date);
                if (isNaN(climbDate)) {
                    return;
                }
                if (climbDate.getFullYear() === currentYear) {
                    const month = climbDate.getMonth();
                    monthCounts[month] += 1;
                }
            });

            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            aggregatedData = monthCounts.map((value, index) => ({
                day: monthNames[index],
                value,
            }));
        } else if (activeView === 'Year') {
            const yearCounts = {};
            data.forEach((climb) => {
                if (!climb.date) {
                    return;
                }
                const climbDate = new Date(climb.date);
                if (isNaN(climbDate)) {
                    return;
                }
                const year = climbDate.getFullYear();
                yearCounts[year] = (yearCounts[year] || 0) + 1;
            });

            aggregatedData = Object.keys(yearCounts).map((key) => ({
                day: key,
                value: yearCounts[key],
            }));
        }

        setClimbData(aggregatedData);
        setGraphKey((prevKey) => prevKey + 1);
    };

    const handleViewChange = (view) => {
        if (view !== activeView) {
            setActiveView(view);
        }
    };

    return (
        <View style={tw`bg-slate-900 p-4`}>
            <View style={tw`flex-row justify-center mb-4`}>
                {['Week', 'Month', 'Year'].map((view) => (
                    <TouchableOpacity
                        key={view}
                        onPress={() => handleViewChange(view)}
                        style={tw`px-4 py-2 mx-2 rounded-2xl ${
                            activeView === view ? 'bg-violet-600' : 'bg-gray-700'
                        }`}
                    >
                        <Text style={tw`text-white font-bold`}>{view}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={tw`items-center h-80`}>
                {climbData.length > 0 ? (
                    <VictoryChart
                        key={graphKey}
                        domainPadding={{ x: 30 }}
                        padding={{ top: 20, bottom: 30, left: 20, right: 20 }}
                        animate={{ duration: 500 }}
                        height={300}
                    >
                        <VictoryAxis
                            style={{
                                axis: { stroke: '#fff', strokeWidth: 2 },
                                tickLabels: { fontSize: 12, fill: '#fff' },
                            }}
                        />
                        <VictoryBar
                            data={climbData}
                            x="day"
                            y="value"
                            barWidth={15}
                            cornerRadius={{ top: 5 }}
                            style={{
                                data: { fill: 'rgb(124, 58, 237)' },
                            }}
                            labels={({ datum }) => `${datum.value}`}
                            labelComponent={<VictoryLabel dy={-10} style={{ fill: 'white', fontSize: 12 }} />}
                            events={[
                                {
                                    target: 'data',
                                    eventHandlers: {
                                        onPressIn: (event, { datum }) => {
                                            if (onBarSelect) {
                                                onBarSelect({
                                                    view: activeView,
                                                    label: datum.day,
                                                    count: datum.value,
                                                });
                                            }
                                        },
                                    },
                                },
                            ]}
                        />
                    </VictoryChart>
                ) : (
                    <Text style={tw`text-white`}>No climb data available for this view.</Text>
                )}
            </View>
        </View>
    );
};

export default BarGraph;
