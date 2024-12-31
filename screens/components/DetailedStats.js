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
                const today = new Date();
                const currentWeek = getWeekStartAndEnd(today);
                const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

                if (
                    dateObj >= currentWeek.start &&
                    dateObj <= currentWeek.end &&
                    dayNames[dateObj.getDay()] === labelVal
                ) {
                    filtered.push(climb);
                }
            } else if (view === 'Month') {
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                if (monthNames[dateObj.getMonth()] === labelVal) {
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

    const getWeekStartAndEnd = (date) => {
        const dayOfWeek = date.getDay();
        const start = new Date(date);
        const end = new Date(date);

        start.setDate(start.getDate() - dayOfWeek);
        start.setHours(0, 0, 0, 0);

        end.setDate(end.getDate() + (6 - dayOfWeek));
        end.setHours(23, 59, 59, 999);

        return { start, end };
    };


    const gradeCounts = {};
    climbs.forEach((climb) => {
        const grade = climb.grade || 'Unknown';
        gradeCounts[grade] = (gradeCounts[grade] || 0) + 1;
    });

    const sortedGradeCounts = Object.entries(gradeCounts)
        .sort(([, countA], [, countB]) => countB - countA)
        .reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {});

    const pieData = Object.keys(sortedGradeCounts).map((grade) => ({
        x: grade,
        y: sortedGradeCounts[grade],
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

    const statsColumns = [];
    const statsArray = Object.keys(sortedGradeCounts).map((grade) => ({
        grade,
        count: sortedGradeCounts[grade],
        color: getColorForGrade(grade),
        label: getDisplayLabel(grade),
    }));
    const columnCount = 4;
    const itemsPerColumn = Math.ceil(statsArray.length / columnCount);

    for (let i = 0; i < columnCount; i++) {
        statsColumns.push(statsArray.slice(i * itemsPerColumn, (i + 1) * itemsPerColumn));
    }

    const getFullLabel = (label, view) => {
        const daysMapping = {
            Sun: 'Sunday',
            Mon: 'Monday',
            Tue: 'Tuesday',
            Wed: 'Wednesday',
            Thu: 'Thursday',
            Fri: 'Friday',
            Sat: 'Saturday',
        };

        const monthsMapping = {
            Jan: 'January',
            Feb: 'February',
            Mar: 'March',
            Apr: 'April',
            May: 'May',
            Jun: 'June',
            Jul: 'July',
            Aug: 'August',
            Sep: 'September',
            Oct: 'October',
            Nov: 'November',
            Dec: 'December',
        };

        if (view === 'Week' && daysMapping[label]) {
            return daysMapping[label];
        }

        if (view === 'Month' && monthsMapping[label]) {
            return monthsMapping[label];
        }

        return label;
    };

    return (
        <View style={tw`mt-4 bg-gray-800 p-4 rounded-lg items-center`}>
            <Text style={tw`text-violet-500 text-lg font-semibold mb-2`}>
                Detailed Stats for {getFullLabel(label, activeView)}
            </Text>

            <VictoryPie
                data={pieData}
                width={450}
                height={450}
                innerRadius={120}
                labelRadius={180}
                colorScale={pieData.map((d) => getColorForGrade(d.x))}
                labels={({ datum }) => (
                    datum.x.startsWith('#') ? '' : getDisplayLabel(datum.x)
                )}
                labelPosition="centroid"
                style={{
                    labels: { fill: 'white', fontSize: 12 },
                }}
            />

            <View style={tw`mt-6 w-full`}>
                <Text style={tw`text-violet-500 text-lg font-semibold mb-4 text-left`}>
                    Total Climbs: {climbs.length}
                </Text>

                <View style={tw`flex-row justify-between`}>
                    {statsColumns.map((column, columnIndex) => (
                        <View key={columnIndex} style={tw`flex-[1.2] px-2`}>
                            {column.map(({ grade, count, color, label }) => (
                                <View key={grade} style={tw`flex-row items-center mb-1`}>
                                    {grade.startsWith('#') && (
                                        <View
                                            style={[
                                                tw`w-4 h-4 rounded-full mr-2`,
                                                { backgroundColor: color },
                                            ]}
                                        />
                                    )}
                                    <Text style={tw`text-violet-200`}>
                                        {label}: {count}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
};

function randomColor(avoidChromaticColors, alreadyUsedRandomColors) {
    const lowerCaseAvoidSet = new Set([
        ...avoidChromaticColors.map((c) => c.toLowerCase()),
        ...alreadyUsedRandomColors.map((c) => c.toLowerCase()),
    ]);

    const getRandomHSL = () => {
        const hue = Math.floor(Math.random() * 360);
        const saturation = Math.random() * (80 - 50) + 50;
        const lightness = Math.random() * (70 - 40) + 40;
        return { hue, saturation, lightness };
    };

    const hslToHex = ({ hue, saturation, lightness }) => {
        const chroma = (1 - Math.abs(2 * (lightness / 100) - 1)) * (saturation / 100);
        const x = chroma * (1 - Math.abs((hue / 60) % 2 - 1));
        const m = lightness / 100 - chroma / 2;
        let r = 0, g = 0, b = 0;

        if (hue >= 0 && hue < 60) {
            r = chroma; g = x; b = 0;
        } else if (hue >= 60 && hue < 120) {
            r = x; g = chroma; b = 0;
        } else if (hue >= 120 && hue < 180) {
            r = 0; g = chroma; b = x;
        } else if (hue >= 180 && hue < 240) {
            r = 0; g = x; b = chroma;
        } else if (hue >= 240 && hue < 300) {
            r = x; g = 0; b = chroma;
        } else {
            r = chroma; g = 0; b = x;
        }

        const toHex = (val) => Math.round((val + m) * 255).toString(16).padStart(2, '0');
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    };

    let color;
    do {
        const hsl = getRandomHSL();
        color = hslToHex(hsl);
    } while (lowerCaseAvoidSet.has(color.toLowerCase()));

    return color;
}

export default DetailedStats;
