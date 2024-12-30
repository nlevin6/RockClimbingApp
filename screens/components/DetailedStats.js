import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { VictoryPie } from 'victory-native';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import app from '../../firebaseConfig';
import tw from '../../tailwind';
import { useGradingSystem } from './GradingContext';

const db = getFirestore(app);

const DetailedStats = ({ activeView, label }) => {
    const [climbs, setClimbs] = useState([]);
    const [gradeColorMap, setGradeColorMap] = useState({});
    const { gradingSystem, chromaticGrades } = useGradingSystem();

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'climbs'), (snapshot) => {
            const allClimbs = snapshot.docs.map((doc) => doc.data());
            const filtered = filterClimbs(allClimbs, activeView, label);
            setClimbs(filtered);
        });
        return () => unsubscribe();
    }, [activeView, label]);

    const filterClimbs = (allClimbs, view, labelVal) => {
        const filtered = [];
        allClimbs.forEach((climb) => {
            const dateObj = new Date(climb.date);
            if (view === 'Week') {
                const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                if (dateObj.getDay() === dayNames.indexOf(labelVal)) {
                    filtered.push(climb);
                }
            } else if (view === 'Month') {
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                if (dateObj.getMonth() === monthNames.indexOf(labelVal)) {
                    filtered.push(climb);
                }
            } else if (view === 'Year') {
                if (dateObj.getFullYear().toString() === labelVal) {
                    filtered.push(climb);
                }
            }
        });
        return filtered;
    };

    const gradeCounts = {};
    climbs.forEach((climb) => {
        const grade = climb.grade || 'Unknown';
        gradeCounts[grade] = (gradeCounts[grade] || 0) + 1;
    });

    const pieData = Object.keys(gradeCounts).map((grade) => ({
        x: grade,
        y: gradeCounts[grade],
    }));

    const usedChromaticColors = chromaticGrades.map((c) => c.color.toLowerCase());

    const getColorForGrade = (grade) => {
        if (
            gradingSystem === 'Chromatic' &&
            usedChromaticColors.includes(grade.toLowerCase())
        ) {
            return grade;
        }
        if (gradeColorMap[grade]) {
            return gradeColorMap[grade];
        }
        const newColor = randomColor(
            usedChromaticColors,
            Object.values(gradeColorMap)
        );
        setGradeColorMap((prevMap) => ({ ...prevMap, [grade]: newColor }));
        return newColor;
    };

    const getDisplayLabel = (grade) => {
        if (grade.startsWith('#')) {
            return '';
        }
        return grade;
    };

    return (
        <View style={tw`mt-4 bg-gray-800 p-4 rounded-lg`}>
            <Text style={tw`text-white text-lg font-semibold mb-2`}>
                Detailed Stats for {label} ({activeView})
            </Text>

            <View style={tw`flex-row items-start`}>
                <View style={tw`mr-4`}>
                    <VictoryPie
                        data={pieData}
                        width={120}
                        height={120}
                        innerRadius={40}
                        colorScale={pieData.map((d) => getColorForGrade(d.x))}
                        labels={({ datum }) => (
                            datum.x.startsWith('#') ? '' : getDisplayLabel(datum.x)
                        )}
                        labelPosition="centroid"
                        style={{
                            labels: { fill: 'white', fontSize: 12 },
                        }}
                    />
                </View>

                <View style={tw`flex-1`}>
                    <Text style={tw`text-white text-base mb-2`}>
                        Total Climbs: {climbs.length}
                    </Text>

                    {Object.keys(gradeCounts).map((grade) => {
                        const colorForThisGrade = getColorForGrade(grade);
                        const displayLabel = getDisplayLabel(grade);
                        return (
                            <View key={grade} style={tw`flex-row items-center mb-1`}>
                                <View
                                    style={[
                                        tw`w-4 h-4 rounded-full mr-2`,
                                        { backgroundColor: colorForThisGrade },
                                    ]}
                                />
                                <Text style={tw`text-white text-base`}>
                                    {displayLabel}: {gradeCounts[grade]}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            </View>
        </View>
    );
};

function randomColor(avoidChromaticColors, alreadyUsedRandomColors) {
    let color;
    const lowerCaseAvoidSet = new Set([
        ...avoidChromaticColors.map((c) => c.toLowerCase()),
        ...alreadyUsedRandomColors.map((c) => c.toLowerCase()),
    ]);

    do {
        color =
            '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    } while (lowerCaseAvoidSet.has(color.toLowerCase()));

    return color;
}

export default DetailedStats;
