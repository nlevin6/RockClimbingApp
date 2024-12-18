import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import tw from '../../tailwind';
import app from '../../firebaseConfig';

const db = getFirestore(app);

const ClimbForm = ({ navigation }) => {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    const [grade, setGrade] = useState('V1');
    const [gradeOpen, setGradeOpen] = useState(false);
    const [gradeItems, setGradeItems] = useState(
        Array.from({ length: 17 }, (_, i) => ({ label: `V${i + 1}`, value: `V${i + 1}` }))
    );

    const [day, setDay] = useState(currentDay);
    const [dayOpen, setDayOpen] = useState(false);
    const [dayItems, setDayItems] = useState([]);

    const [month, setMonth] = useState(currentMonth);
    const [monthOpen, setMonthOpen] = useState(false);
    const [monthItems, setMonthItems] = useState(
        Array.from({ length: 12 }, (_, i) => ({ label: `${i + 1}`, value: i + 1 }))
    );

    const [year, setYear] = useState(currentYear);
    const [yearOpen, setYearOpen] = useState(false);
    const [yearItems, setYearItems] = useState(
        Array.from({ length: 11 }, (_, i) => ({ label: `${currentYear - i}`, value: currentYear - i }))
    );

    const calculateDaysInMonth = (month, year) => {
        const daysInMonth = new Date(year, month, 0).getDate();
        return Array.from({ length: daysInMonth }, (_, i) => ({
            label: `${i + 1}`,
            value: i + 1,
        }));
    };

    useEffect(() => {
        const days = calculateDaysInMonth(month, year);
        setDayItems(days);
        if (day > days.length) {
            setDay(days.length);
        }
    }, [month, year]);

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
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to add climb. Please try again.');
            console.error(error);
        }
    };

    return (
        <View style={tw`flex-1 bg-slate-900 p-4`}>
            <Text style={tw`text-white mb-2 text-lg font-bold`}>Grade:</Text>
            <DropDownPicker
                open={gradeOpen}
                value={grade}
                items={gradeItems}
                setOpen={(open) => {
                    resetDropdowns('grade');
                    setGradeOpen(open);
                }}
                setValue={setGrade}
                setItems={setGradeItems}
                zIndex={3000}
            />

            <Text style={tw`text-white mb-2 text-lg font-bold`}>Date Completed:</Text>
            <View style={tw`flex-row justify-between`}>
                <View style={tw`flex-1 mr-2`}>
                    <Text style={tw`text-white mb-1`}>Day:</Text>
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
                        zIndex={2000}
                    />
                </View>

                <View style={tw`flex-1 mx-2`}>
                    <Text style={tw`text-white mb-1`}>Month:</Text>
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
                        zIndex={1500}
                    />
                </View>

                <View style={tw`flex-1 ml-2`}>
                    <Text style={tw`text-white mb-1`}>Year:</Text>
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
                        zIndex={1000}
                    />
                </View>
            </View>

            <View style={tw`flex-row justify-between mt-4`}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={tw`bg-red-500 p-3 rounded`}>
                    <Text style={tw`text-white`}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSubmit} style={tw`bg-green-500 p-3 rounded`}>
                    <Text style={tw`text-white`}>Add</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ClimbForm;
