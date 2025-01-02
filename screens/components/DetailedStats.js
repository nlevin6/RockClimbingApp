import React, { useEffect, useState } from 'react';
import { View, Text, Animated, Alert } from 'react-native';
import { VictoryPie } from 'victory-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import tw from '../../tailwind';
import { useGradingSystem } from './GradingContext';

const DetailedStats = ({ activeView, label }) => {
    const [climbs, setClimbs] = useState([]);
    const [gradeColorMap, setGradeColorMap] = useState({});
    const { gradingSystem, chromaticGrades } = useGradingSystem();
    const [animationComplete, setAnimationComplete] = useState(false);
    const [selectedSegment, setSelectedSegment] = useState(null);
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            Alert.alert('Error', 'No user logged in. Please log in to view your climbs.');
            return;
        }

        const collectionPath = `users/${user.uid}/climbs`;
        const climbsRef = collection(db, collectionPath);

        const unsubscribe = onSnapshot(
            climbsRef,
            (snapshot) => {
                const allClimbs = snapshot.docs.map((doc) => doc.data());
                const filteredClimbs = filterClimbs(allClimbs, activeView, label);
                setClimbs(filteredClimbs);
                setAnimationComplete(false);
            },
            () => {
                Alert.alert('Error', 'Failed to fetch climbs. Please try again later.');
            }
        );

        return () => unsubscribe();
    }, [activeView, label]);

    useEffect(() => {
        if (climbs.length > 0) {
            const timer = setTimeout(() => setAnimationComplete(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [climbs]);

    useEffect(() => {
        if (selectedSegment) {
            fadeAnim.setValue(0);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start(() => setSelectedSegment(null));
        }
    }, [selectedSegment]);

    const gradeCounts = climbs.reduce((counts, climb) => {
        const grade = climb.grade || 'Unknown';
        counts[grade] = (counts[grade] || 0) + 1;
        return counts;
    }, {});

    const sortedGradeCounts = Object.entries(gradeCounts)
        .sort(([, countA], [, countB]) => countB - countA)
        .reduce((obj, [grade, count]) => {
            obj[grade] = count;
            return obj;
        }, {});

    const pieData = Object.keys(sortedGradeCounts).map((grade, index) => ({
        id: index,
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
        const newColor = randomColor(usedChromaticColors, Object.values(gradeColorMap));
        setGradeColorMap((prevMap) => ({ ...prevMap, [grade]: newColor }));
        return newColor;
    };

    const isChromaticGrade = (grade) =>
        chromaticGrades.some((cg) => cg.color.toLowerCase() === grade.toLowerCase());

    const getDisplayLabel = (grade) =>
        grade.startsWith('#') || grade.startsWith('rgb(') || isChromaticGrade(grade)
            ? ''
            : grade;

    const statsArray = Object.keys(sortedGradeCounts)
        .map((grade) => ({
            grade,
            count: sortedGradeCounts[grade],
            color: getColorForGrade(grade),
            label: getDisplayLabel(grade),
        }))
        .sort((a, b) => b.count - a.count);

    const columnCount = 5;
    const itemsPerColumn = Math.ceil(statsArray.length / columnCount);
    const statsColumns = Array.from({ length: columnCount }, (_, i) =>
        statsArray.slice(i * itemsPerColumn, (i + 1) * itemsPerColumn)
    );

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

    const calculateLabelPositions = (data, width, height) => {
        const total = data.reduce((sum, d) => sum + d.y, 0);
        let cumulative = 0;
        const centerX = width / 2;
        const centerY = height / 2;
        const labelRadius = 190;
        const innerLabelRadius = 105;

        return data.map((d) => {
            const startAngle = (cumulative / total) * 360;
            const endAngle = ((cumulative + d.y) / total) * 360;
            const midAngle = (startAngle + endAngle) / 2;
            cumulative += d.y;

            const rad = (midAngle - 90) * (Math.PI / 180);

            const x = centerX + labelRadius * Math.cos(rad);
            const y = centerY + labelRadius * Math.sin(rad);

            const innerX = centerX + innerLabelRadius * Math.cos(rad);
            const innerY = centerY + innerLabelRadius * Math.sin(rad);

            return {
                x,
                y,
                innerX,
                innerY,
                label: getDisplayLabel(d.x),
                color: getColorForGrade(d.x),
            };
        });
    };

    const handleSegmentPress = (segment) => {
        const matchingSegment = pieData.find((data) => data.id === segment.id);
        setSelectedSegment(matchingSegment || null);
    };

    return (
        <View style={tw`mt-4 bg-gray-800 p-4 rounded-lg items-center`}>
            <Text style={tw`text-violet-500 text-lg font-semibold mb-2`}>
                Detailed Stats for {getFullLabel(label, activeView)}
            </Text>

            <View style={{ position: 'relative', width: 450, height: 450 }}>
                <VictoryPie
                    data={pieData}
                    width={450}
                    height={450}
                    innerRadius={120}
                    labelRadius={180}
                    colorScale={pieData.map((d) => getColorForGrade(d.x))}
                    labels={() => ''}
                    style={{
                        labels: { fill: 'white', fontSize: 12 },
                    }}
                    animate={{
                        data: {
                            duration: 2000,
                            easing: 'cubicInOut',
                        },
                        labels: {
                            duration: 0,
                        },
                        onLoad: { duration: 2000 },
                    }}
                    events={[
                        {
                            target: 'data',
                            eventHandlers: {
                                onPressIn: (_, dataProps) => {
                                    handleSegmentPress(dataProps.datum);
                                },
                            },
                        },
                    ]}
                />

                {animationComplete && (
                    <View style={{ position: 'absolute', top: 0, left: 0, width: 450, height: 450 }}>
                        {calculateLabelPositions(pieData, 450, 450).map((item, index) => (
                            <React.Fragment key={index}>
                                {item.label && !item.label.startsWith('#') && (
                                    <Text
                                        style={{
                                            position: 'absolute',
                                            left: item.x,
                                            top: item.y,
                                            transform: [{ translateX: -10 }, { translateY: -10 }],
                                            color: 'rgb(221, 214, 254)',
                                            fontSize: 12,
                                            fontWeight: 'bold',
                                            textShadowColor: 'black',
                                            textShadowOffset: { width: 0.5, height: 0.5 },
                                            textShadowRadius: 1,
                                        }}
                                    >
                                        {item.label}
                                    </Text>
                                )}
                                {selectedSegment && selectedSegment.id === index && (
                                    <Animated.Text
                                        style={{
                                            position: 'absolute',
                                            left: item.innerX,
                                            top: item.innerY,
                                            transform: [{ translateX: -10 }, { translateY: -10 }],
                                            color: 'white',
                                            fontSize: 12,
                                            fontWeight: 'bold',
                                            textShadowColor: 'black',
                                            textShadowOffset: { width: 0.5, height: 0.5 },
                                            textShadowRadius: 1,
                                            opacity: fadeAnim,
                                        }}
                                    >
                                        {((selectedSegment.y / pieData.reduce((sum, d) => sum + d.y, 0)) * 100).toFixed(1)}%
                                    </Animated.Text>
                                )}
                            </React.Fragment>
                        ))}
                    </View>
                )}
            </View>

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

const filterClimbs = (allClimbs, view, labelVal) => {
    return allClimbs.filter((climb) => {
        const dateObj = new Date(climb.date);

        if (view === 'Week') {
            const today = new Date();
            const currentWeek = getWeekStartAndEnd(today);
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

            const dayName = dayNames[dateObj.getDay()];

            return (
                dateObj >= currentWeek.start &&
                dateObj <= currentWeek.end &&
                dayName === labelVal
            );
        } else if (view === 'Month') {
            const monthNames = [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
            ];
            const climbMonth = monthNames[dateObj.getMonth()];

            return climbMonth === labelVal;
        } else if (view === 'Year') {
            const climbYear = dateObj.getFullYear().toString();

            return climbYear === labelVal;
        }
        return false;
    });
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
