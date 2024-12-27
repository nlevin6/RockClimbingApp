import React, { useState, useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
import tw from '../../tailwind';
import { useGradingSystem } from './GradingContext';
import { Text, View, Alert } from "react-native";
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import app from '../../firebaseConfig';

const db = getFirestore(app);

const CustomArrowDown = () => <Ionicons name="chevron-down" size={20} color="#8b5cf6" />;
const CustomArrowUp = () => <Ionicons name="chevron-up" size={20} color="#8b5cf6" />;

const GradingSystemSelect = () => {
    const { gradingSystem, setGradingSystem } = useGradingSystem();

    const [gradingOpen, setGradingOpen] = useState(false);
    const [localValue, setLocalValue] = useState(gradingSystem);
    const [gradingItems, setGradingItems] = useState([
        { label: 'Hueco (USA)', value: 'Hueco (USA)' },
        { label: 'Fontainebleau', value: 'Fontainebleau' },
        { label: 'Yosemite Decimal System', value: 'Yosemite Decimal System' },
    ]);

    useEffect(() => {
        const fetchGradingSystem = async () => {
            try {
                const docRef = doc(db, 'settings', 'gradingSystem');
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const savedGradingSystem = docSnap.data().gradingSystem;
                    setGradingSystem(savedGradingSystem);
                    setLocalValue(savedGradingSystem);
                } else {
                    console.log("No grading system found in the database.");
                }
            } catch (error) {
                console.error("Error fetching grading system:", error);
                Alert.alert("Error", "Failed to fetch grading system from the database.");
            }
        };

        fetchGradingSystem();
    }, []);

    const handleChangeValue = async (value) => {
        try {
            const docRef = doc(db, 'settings', 'gradingSystem');
            await setDoc(docRef, { gradingSystem: value });
            setGradingSystem(value);
            setLocalValue(value);
        } catch (error) {
            console.error("Error saving grading system:", error);
            Alert.alert("Error", "Failed to save grading system to the database.");
        }
    };

    return (
        <View style={tw`flex-1 pt-0 pb-4 px-4 bg-slate-900`}>
            <Text style={tw`text-violet-200 text-lg mb-2`}>Grading System</Text>
            <DropDownPicker
                open={gradingOpen}
                value={localValue}
                items={gradingItems}
                setOpen={setGradingOpen}
                setValue={setLocalValue}
                setItems={setGradingItems}
                onChangeValue={handleChangeValue}
                style={tw`rounded-2xl bg-slate-900 border border-slate-700`}
                dropDownContainerStyle={tw`rounded-2xl bg-slate-900 border border-slate-700`}
                textStyle={tw`text-violet-200`}
                ArrowDownIconComponent={CustomArrowDown}
                ArrowUpIconComponent={CustomArrowUp}
            />
        </View>
    );
};

export default GradingSystemSelect;
