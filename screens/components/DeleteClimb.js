import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { getFirestore, collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
import tw from '../../tailwind';
import app from '../../firebaseConfig';
import { useGradingSystem } from "./GradingContext";
import gradingSystems from '../../screens/constants/gradingSystems';

const db = getFirestore(app);

const CustomArrowDown = () => <Ionicons name="chevron-down" size={20} color="#8b5cf6" />;
const CustomArrowUp = () => <Ionicons name="chevron-up" size={20} color="#8b5cf6" />;

const DeleteClimb = () => {
    const { gradingSystem } = useGradingSystem();
    const gradeItems = [
        { label: 'Select', value: null },
        ...(gradingSystems[gradingSystem] || []),
    ];




    const [climbs, setClimbs] = useState([]);
    const [filteredClimbs, setFilteredClimbs] = useState([]);

    const [selectedGrade, setSelectedGrade] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    const [gradeOpen, setGradeOpen] = useState(false);
    const [dateOpen, setDateOpen] = useState(false);

    const [gradingItems, setGradingItems] = useState([]);
    const [dateItems, setDateItems] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'climbs'), (snapshot) => {
            const climbsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setClimbs(climbsData);

            const uniqueGrades = [
                { label: 'Select', value: null },
                ...Array.from(new Set(climbsData.map((climb) => climb.grade)))
                    .sort((a, b) => parseInt(a.replace('V', ''), 10) - parseInt(b.replace('V', ''), 10))
                    .map((grade) => ({ label: grade, value: grade })),
            ];
            setGradingItems(uniqueGrades);

            const uniqueDates = [
                { label: 'Select', value: null },
                ...Array.from(new Set(climbsData.map((climb) => new Date(climb.date).toDateString())))
                    .sort((a, b) => new Date(b) - new Date(a))
                    .map((date) => ({ label: date, value: date })),
            ];
            setDateItems(uniqueDates);

            filterClimbs(climbsData, selectedGrade, selectedDate);
        });

        return () => unsubscribe();
    }, [selectedGrade, selectedDate]);

    const filterClimbs = (climbsData, gradeFilter, dateFilter) => {
        let filtered = climbsData;

        if (gradeFilter) {
            filtered = filtered.filter((climb) => climb.grade === gradeFilter);
        }

        if (dateFilter) {
            filtered = filtered.filter(
                (climb) =>
                    new Date(climb.date).toDateString() === new Date(dateFilter).toDateString()
            );
        }

        setFilteredClimbs(filtered);
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'climbs', id));
            Alert.alert('Success', 'Climb deleted successfully!');
        } catch (error) {
            Alert.alert('Error', 'Failed to delete climb');
            console.error(error);
        }
    };

    const resetDropdowns = (except) => {
        if (except !== 'grade') setGradeOpen(false);
        if (except !== 'date') setDateOpen(false);
    };

    return (
        <View style={tw`flex-1 p-4`}>
            <Text style={tw`text-violet-600 text-xl font-bold mb-2`}>Delete Climb</Text>

            <DropDownPicker
                open={gradeOpen}
                value={selectedGrade}
                items={gradeItems}
                setOpen={(open) => {
                    resetDropdowns('grade');
                    setGradeOpen(open);
                }}
                setValue={setSelectedGrade}
                setItems={setGradingItems}
                placeholder="Select Grade"
                style={[
                    tw`mb-2 mt-2 rounded-2xl bg-slate-900 border border-slate-700`,
                ]}
                dropDownContainerStyle={[
                    tw`rounded-2xl bg-slate-900 border border-slate-700`,
                ]}
                textStyle={[
                    tw`text-violet-200`,
                ]}
                ArrowDownIconComponent={CustomArrowDown}
                ArrowUpIconComponent={CustomArrowUp}
                zIndex={300}
                zIndexInverse={100}
            />

            <DropDownPicker
                open={dateOpen}
                value={selectedDate}
                items={dateItems}
                setOpen={(open) => {
                    resetDropdowns('date');
                    setDateOpen(open);
                }}
                setValue={setSelectedDate}
                setItems={setDateItems}
                placeholder="Select Date"
                style={[
                    tw`mb-4 mt-2 rounded-2xl bg-slate-900 border border-slate-700`,
                ]}
                dropDownContainerStyle={[
                    tw`rounded-2xl bg-slate-900 border border-slate-700`,
                ]}
                textStyle={[
                    tw`text-violet-200`,
                ]}
                ArrowDownIconComponent={CustomArrowDown}
                ArrowUpIconComponent={CustomArrowUp}
                zIndex={200}
                zIndexInverse={100}
            />

            <FlatList
                data={filteredClimbs}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={tw`flex-row justify-between items-center mb-2`}>
                        <Text style={tw`text-violet-200`}>
                            {item.grade} - {new Date(item.date).toDateString()}
                        </Text>
                        <TouchableOpacity
                            onPress={() => handleDelete(item.id)}
                            style={tw`bg-red-500 p-2 rounded-2xl`}
                        >
                            <Text style={tw`text-white font-bold`}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={tw`text-gray-400 text-center mt-4`}>
                        No climbs match the selected criteria.
                    </Text>
                }
            />
        </View>
    );
};

export default DeleteClimb;
