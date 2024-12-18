import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import tw from '../tailwind';
import app from '../firebaseConfig';

const db = getFirestore(app);

const AddClimb = ({ navigation }) => {
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

    const onGradeOpen = () => {
        setDayOpen(false);
        setMonthOpen(false);
        setYearOpen(false);
    };
    const onDayOpen = () => {
        setGradeOpen(false);
        setMonthOpen(false);
        setYearOpen(false);
    };
    const onMonthOpen = () => {
        setGradeOpen(false);
        setDayOpen(false);
        setYearOpen(false);
    };
    const onYearOpen = () => {
        setGradeOpen(false);
        setDayOpen(false);
        setMonthOpen(false);
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
                setOpen={setGradeOpen}
                setValue={setGrade}
                setItems={setGradeItems}
                style={tw`mb-4`}
                onOpen={onGradeOpen}
            />

            <Text style={tw`text-white mb-2 text-lg font-bold`}>Date Completed:</Text>
            <View style={tw`flex-row justify-between`}>
                <View style={tw`flex-1 mr-2`}>
                    <Text style={tw`text-white mb-1`}>Day:</Text>
                    <DropDownPicker
                        open={dayOpen}
                        value={day}
                        items={dayItems}
                        setOpen={setDayOpen}
                        setValue={setDay}
                        setItems={setDayItems}
                        onOpen={onDayOpen}
                    />
                </View>

                <View style={tw`flex-1 mx-2`}>
                    <Text style={tw`text-white mb-1`}>Month:</Text>
                    <DropDownPicker
                        open={monthOpen}
                        value={month}
                        items={monthItems}
                        setOpen={setMonthOpen}
                        setValue={setMonth}
                        setItems={setMonthItems}
                        onOpen={onMonthOpen}
                    />
                </View>

                <View style={tw`flex-1 ml-2`}>
                    <Text style={tw`text-white mb-1`}>Year:</Text>
                    <DropDownPicker
                        open={yearOpen}
                        value={year}
                        items={yearItems}
                        setOpen={setYearOpen}
                        setValue={setYear}
                        setItems={setYearItems}
                        onOpen={onYearOpen}
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

export default AddClimb;
