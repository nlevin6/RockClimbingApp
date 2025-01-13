import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import {VictoryBar, VictoryChart, VictoryAxis, VictoryLabel} from 'victory-native';
import {collection, onSnapshot} from 'firebase/firestore';
import {auth, db} from '../../firebaseConfig';
import tw from '../../tailwind';

const BarGraph = ({onBarSelect}) => {
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

            const dayCounts = {Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0};

            data.forEach((climb) => {
                if (!climb.date) return;
                const climbDate = new Date(climb.date);
                if (isNaN(climbDate)) return;

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
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const past12Months = [];
            const today = new Date();
            let currentMonth = today.getMonth();
            let currentYear = today.getFullYear();

            for (let i = 0; i < 12; i++) {
                past12Months.unshift({
                    month: monthNames[currentMonth],
                    year: currentYear,
                    count: 0,
                });
                currentMonth--;
                if (currentMonth < 0) {
                    currentMonth = 11;
                    currentYear--;
                }
            }

            data.forEach((climb) => {
                if (!climb.date) return;
                const climbDate = new Date(climb.date);
                if (isNaN(climbDate)) return;

                const climbMonth = climbDate.getMonth();
                const climbYear = climbDate.getFullYear();

                past12Months.forEach((entry) => {
                    if (entry.month === monthNames[climbMonth] && entry.year === climbYear) {
                        entry.count += 1;
                    }
                });
            });

            aggregatedData = past12Months.map((entry) => ({
                day: `${entry.month}`,
                value: entry.count,
            }));
        } else if (activeView === 'Year') {
            const yearCounts = {};
            data.forEach((climb) => {
                if (!climb.date) return;
                const climbDate = new Date(climb.date);
                if (isNaN(climbDate)) return;

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

        //--------------------------------------------------------------------
        //  ⬇️  Automatically select the most recent weekly day if 'Week' view
        //--------------------------------------------------------------------
        if (activeView === 'Week' && aggregatedData && aggregatedData.length > 0) {
            const dayMapping = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const todayName = dayMapping[new Date().getDay()];

            // Try to find today's bar if it has any climbs
            let defaultSelection = aggregatedData.find((d) => d.day === todayName && d.value > 0);

            // If today's bar has 0 climbs or doesn't exist, pick the first day that has climbs
            if (!defaultSelection) {
                defaultSelection = aggregatedData.find((d) => d.value > 0) || aggregatedData[0];
            }

            if (defaultSelection && onBarSelect) {
                onBarSelect({
                    view: activeView,
                    label: defaultSelection.day,
                    count: defaultSelection.value,
                });
            }
        }
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
                        domainPadding={{x: 30}}
                        padding={{top: 20, bottom: 30, left: 20, right: 20}}
                        animate={{duration: 500}}
                        height={300}
                    >
                        <VictoryAxis
                            style={{
                                axis: {stroke: '#fff', strokeWidth: 2},
                                tickLabels: {fontSize: 12, fill: '#fff'},
                            }}
                        />
                        <VictoryBar
                            data={climbData}
                            x="day"
                            y="value"
                            barWidth={25}
                            cornerRadius={{top: 5}}
                            style={{
                                data: {fill: 'rgb(124, 58, 237)'},
                            }}
                            labels={({datum}) => String(datum.value)}
                            labelComponent={<VictoryLabel dy={-10} style={{fill: 'white', fontSize: 12}} />}
                            events={[
                                {
                                    target: 'data',
                                    eventHandlers: {
                                        onPressIn: (event, {datum}) => {
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
