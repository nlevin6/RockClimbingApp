import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
import tw from '../../tailwind';
import { auth, db } from '../../firebaseConfig';
import { useGradingSystem } from "./GradingContext";
import gradingSystems from '../../screens/constants/gradingSystems';

const CustomArrowDown = () => <Ionicons name="chevron-down" size={20} color="#8b5cf6" />;
const CustomArrowUp = () => <Ionicons name="chevron-up" size={20} color="#8b5cf6" />;

const isHexColor = (str) => /^#([0-9A-F]{3}){1,2}$/i.test(str);

const DeleteClimb = () => {
    const { gradingSystem, chromaticGrades } = useGradingSystem();
    const [gradingItems, setGradingItems] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [dateItems, setDateItems] = useState([{ label: 'Select', value: null }]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [gradeOpen, setGradeOpen] = useState(false);
    const [dateOpen, setDateOpen] = useState(false);
    const [climbs, setClimbs] = useState([]);
    const [filteredClimbs, setFilteredClimbs] = useState([]);
    const [loadingDelete, setLoadingDelete] = useState(null);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const unsubscribe = onSnapshot(collection(db, `users/${user.uid}/climbs`), (snapshot) => {
            const climbsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            const sortedClimbs = climbsData.sort((a, b) => new Date(b.date) - new Date(a.date));
            setClimbs(sortedClimbs);

            const uniqueDates = [
                { label: 'Select', value: null },
                ...Array.from(new Set(sortedClimbs.map((c) => new Date(c.date).toDateString())))
                    .map((d) => ({ label: d, value: d })),
            ];
            setDateItems(uniqueDates);

            filterClimbs(sortedClimbs, selectedGrade, selectedDate);
        });

        return () => unsubscribe();
    }, [selectedGrade, selectedDate]);

    const handleDelete = async (id) => {
        const user = auth.currentUser;
        if (!user) {
            Alert.alert('Error', 'You must be logged in to delete a climb.');
            return;
        }

        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this climb?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {
                            setLoadingDelete(id);
                            await deleteDoc(doc(db, `users/${user.uid}/climbs`, id));
                        } catch {
                            Alert.alert('Error', 'Failed to delete climb');
                        } finally {
                            setLoadingDelete(null);
                        }
                    },
                    style: 'destructive',
                },
            ]
        );
    };

    useEffect(() => {
        let newBaseItems = [];

        if (gradingSystem === 'Chromatic') {
            newBaseItems = chromaticGrades.map((item) => item.color);
        } else {
            const systemGrades = gradingSystems[gradingSystem] || [];
            newBaseItems = systemGrades.map((gradeObj) => gradeObj.value ?? gradeObj);
        }

        const mappedItems = newBaseItems.map((grade) => {
            if (isHexColor(grade)) {
                return {
                    label: '',
                    value: grade,
                    icon: () => (
                        <View
                            style={{
                                width: 20,
                                height: 20,
                                backgroundColor: grade,
                                borderRadius: 4,
                                marginRight: 8,
                            }}
                        />
                    ),
                };
            } else {
                return {
                    label: grade,
                    value: grade,
                };
            }
        });

        const newGradeItems = [{ label: 'Select', value: null }, ...mappedItems];
        setGradingItems(newGradeItems);
    }, [gradingSystem, chromaticGrades]);

    const filterClimbs = (climbsData, gradeFilter, dateFilter) => {
        let filtered = [...climbsData];

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

    const resetDropdowns = (except) => {
        if (except !== 'grade') setGradeOpen(false);
        if (except !== 'date') setDateOpen(false);
    };

    return (
        <View style={tw`flex-1 p-4 bg-slate-900`}>
            <Text style={tw`text-violet-600 text-xl font-bold mb-2`}>Delete Climb</Text>

            <DropDownPicker
                open={gradeOpen}
                value={selectedGrade}
                items={gradingItems}
                setOpen={(open) => {
                    resetDropdowns('grade');
                    setGradeOpen(open);
                }}
                setValue={setSelectedGrade}
                setItems={setGradingItems}
                placeholder="Select Grade"
                style={tw`mb-2 mt-2 rounded-2xl bg-slate-900 border border-slate-700`}
                dropDownContainerStyle={tw`rounded-2xl bg-slate-900 border border-slate-700`}
                textStyle={tw`text-violet-200`}
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
                style={tw`mb-4 mt-2 rounded-2xl bg-slate-900 border border-slate-700`}
                dropDownContainerStyle={tw`rounded-2xl bg-slate-900 border border-slate-700`}
                textStyle={tw`text-violet-200`}
                ArrowDownIconComponent={CustomArrowDown}
                ArrowUpIconComponent={CustomArrowUp}
                zIndex={200}
                zIndexInverse={100}
            />

            <View style={tw`border border-violet-600 rounded-lg p-4 flex-1`}>
                <FlatList
                    data={filteredClimbs}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={tw`flex-row justify-between items-center mb-2`}>
                            <View style={tw`flex-row items-center`}>
                                {isHexColor(item.grade) ? (
                                    <>
                                        <View
                                            style={[
                                                {
                                                    width: 20,
                                                    height: 20,
                                                    borderRadius: 4,
                                                    backgroundColor: item.grade,
                                                    marginRight: 8,
                                                },
                                            ]}
                                        />
                                        <Text style={tw`text-violet-200`}>
                                            {new Date(item.date).toDateString()}
                                        </Text>
                                    </>
                                ) : (
                                    <Text style={tw`text-violet-200`}>
                                        {item.grade} - {new Date(item.date).toDateString()}
                                    </Text>
                                )}
                            </View>

                            <TouchableOpacity
                                onPress={() => handleDelete(item.id)}
                                style={tw`p-2 rounded-2xl ${
                                    loadingDelete === item.id ? 'bg-gray-600' : 'bg-red-600'
                                }`}
                                disabled={loadingDelete === item.id}
                            >
                                {loadingDelete === item.id ? (
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                    <Text style={tw`text-white font-bold`}>Delete</Text>
                                )}
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
        </View>
    );

};

export default DeleteClimb;
