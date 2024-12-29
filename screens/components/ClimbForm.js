import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import tw from '../../tailwind';
import app from '../../firebaseConfig';
import { useGradingSystem } from './GradingContext';
import gradingSystems from '../constants/gradingSystems';

const db = getFirestore(app);

const CustomArrowDown = () => <Ionicons name="chevron-down" size={20} color="#8b5cf6" />;
const CustomArrowUp = () => <Ionicons name="chevron-up" size={20} color="#8b5cf6" />;

const ClimbForm = ({ navigation }) => {
    const { gradingSystem, chromaticGrades } = useGradingSystem();

    let gradeItems = [];
    if (gradingSystem === 'Chromatic') {
        gradeItems = chromaticGrades.map((item) => ({
            label: '',
            value: item.color,
            icon: () => (
                <View
                    style={{
                        width: 20,
                        height: 20,
                        backgroundColor: item.color,
                        borderRadius: 4,
                        marginRight: 8,
                    }}
                />
            ),
        }));
    } else {
        gradeItems = gradingSystems[gradingSystem] || [];
    }

    const [grade, setGrade] = useState(gradeItems[0]?.value || null);
    const [gradeOpen, setGradeOpen] = useState(false);
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    const [day, setDay] = useState(currentDay.toString());
    const [dayOpen, setDayOpen] = useState(false);
    const [dayItems, setDayItems] = useState([]);
    const [month, setMonth] = useState(currentMonth.toString());
    const [monthOpen, setMonthOpen] = useState(false);
    const [monthItems, setMonthItems] = useState([
        { label: 'Jan', value: '1' },
        { label: 'Feb', value: '2' },
        { label: 'Mar', value: '3' },
        { label: 'Apr', value: '4' },
        { label: 'May', value: '5' },
        { label: 'Jun', value: '6' },
        { label: 'Jul', value: '7' },
        { label: 'Aug', value: '8' },
        { label: 'Sep', value: '9' },
        { label: 'Oct', value: '10' },
        { label: 'Nov', value: '11' },
        { label: 'Dec', value: '12' },
    ]);

    const [year, setYear] = useState(currentYear.toString());
    const [yearOpen, setYearOpen] = useState(false);
    const [yearItems, setYearItems] = useState(
        Array.from({ length: 11 }, (_, i) => ({
            label: `${currentYear - i}`,
            value: `${currentYear - i}`,
        }))
    );

    const calculateDaysInMonth = (m, y) => {
        const daysInMonth = new Date(y, m, 0).getDate();
        return Array.from({ length: daysInMonth }, (_, i) => ({
            label: `${i + 1}`,
            value: `${i + 1}`,
        }));
    };

    useEffect(() => {
        const days = calculateDaysInMonth(month, year);
        setDayItems(days);
        if (parseInt(day, 10) > days.length) {
            setDay(days.length.toString());
        }
    }, [month, year]);

    useEffect(() => {
        if (gradingSystem === 'Chromatic') {
            const updatedChromaticItems = chromaticGrades.map((item, index) => ({
                label: `Color ${index + 1}: ${item.color}`,
                value: item.color,
            }));
            setGrade(updatedChromaticItems[0]?.value || null);
        } else {
            const standardItems = gradingSystems[gradingSystem] || [];
            setGrade(standardItems[0]?.value || null);
        }
    }, [gradingSystem, chromaticGrades]);

    const resetDropdowns = (except) => {
        if (except !== 'grade') setGradeOpen(false);
        if (except !== 'day') setDayOpen(false);
        if (except !== 'month') setMonthOpen(false);
        if (except !== 'year') setYearOpen(false);
    };

    const handleSubmit = async () => {
        if (!grade || !day || !month || !year) {
            Alert.alert('Error', 'Please select a grade and a valid date before submitting.');
            return;
        }

        const selectedDate = new Date(year, month - 1, day);

        try {
            await addDoc(collection(db, 'climbs'), {
                grade,
                date: selectedDate.toISOString(),
            });
            Alert.alert('Success', 'Climb added successfully!');
        } catch (error) {
            Alert.alert('Error', 'Failed to add climb. Please try again.');
            console.error(error);
        }
    };

    return (
        <View style={tw`p-4 bg-slate-900`}>
            <Text style={tw`text-violet-600 mb-2 text-xl font-bold`}>Add Climb</Text>

            <DropDownPicker
                open={gradeOpen}
                value={grade}
                items={gradeItems}
                setOpen={(open) => {
                    resetDropdowns('grade');
                    setGradeOpen(open);
                }}
                setValue={setGrade}
                placeholder="Select Grade"
                style={tw`rounded-2xl bg-slate-900 border border-slate-700`}
                dropDownContainerStyle={tw`rounded-2xl bg-slate-900 border border-slate-700`}
                textStyle={tw`text-violet-200`}
                ArrowDownIconComponent={CustomArrowDown}
                ArrowUpIconComponent={CustomArrowUp}
                zIndex={3000}
            />

            <View style={tw`flex-row justify-between mt-4`}>
                <View style={[tw`flex-1 mr-1`, { zIndex: 2000 }]}>
                    <DropDownPicker
                        open={dayOpen}
                        value={day}
                        items={dayItems}
                        setOpen={(open) => {
                            resetDropdowns('day');
                            setDayOpen(open);
                        }}
                        setValue={setDay}
                        setItems={setDayItems}
                        placeholder="Day"
                        style={tw`rounded-2xl bg-slate-900 border border-slate-700`}
                        dropDownContainerStyle={tw`rounded-2xl bg-slate-900 border border-slate-700`}
                        textStyle={tw`text-violet-200`}
                        ArrowDownIconComponent={CustomArrowDown}
                        ArrowUpIconComponent={CustomArrowUp}
                    />
                </View>

                <View style={[tw`flex-1 mx-1`, { zIndex: 1500 }]}>
                    <DropDownPicker
                        open={monthOpen}
                        value={month}
                        items={monthItems}
                        setOpen={(open) => {
                            resetDropdowns('month');
                            setMonthOpen(open);
                        }}
                        setValue={setMonth}
                        setItems={setMonthItems}
                        placeholder="Month"
                        style={tw`rounded-2xl bg-slate-900 border border-slate-700`}
                        dropDownContainerStyle={tw`rounded-2xl bg-slate-900 border border-slate-700`}
                        textStyle={tw`text-violet-200`}
                        ArrowDownIconComponent={CustomArrowDown}
                        ArrowUpIconComponent={CustomArrowUp}
                    />
                </View>

                <View style={[tw`flex-1 ml-1`, { zIndex: 1000 }]}>
                    <DropDownPicker
                        open={yearOpen}
                        value={year}
                        items={yearItems}
                        setOpen={(open) => {
                            resetDropdowns('year');
                            setYearOpen(open);
                        }}
                        setValue={setYear}
                        setItems={setYearItems}
                        placeholder="Year"
                        style={tw`rounded-2xl bg-slate-900 border border-slate-700`}
                        dropDownContainerStyle={tw`rounded-2xl bg-slate-900 border border-slate-700`}
                        textStyle={tw`text-violet-200`}
                        ArrowDownIconComponent={CustomArrowDown}
                        ArrowUpIconComponent={CustomArrowUp}
                    />
                </View>
            </View>

            <View style={tw`flex-row justify-center mt-2`}>
                <TouchableOpacity
                    onPress={handleSubmit}
                    style={tw`bg-violet-600 p-2 rounded w-full px-4 py-2 mx-2 rounded-2xl`}
                >
                    <Text style={tw`text-white font-bold text-center text-sm`}>Add</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ClimbForm;
