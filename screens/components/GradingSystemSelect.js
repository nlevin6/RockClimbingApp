import React, { useState, useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
import tw from '../../tailwind';
import { useGradingSystem } from './GradingContext';
import { Text, View } from "react-native";

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
        { label: 'Chromatic', value: 'Chromatic' },
    ]);

    useEffect(() => {
        setLocalValue(gradingSystem);
    }, [gradingSystem]);

    const handleChangeValue = async (value) => {
        setGradingSystem(value);
        setLocalValue(value);
    };

    return (
        <View style={tw` px-4 bg-slate-900`}>
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
