import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import tw from '../tailwind';

const AddClimb = ({ navigation }) => {
    const [grade, setGrade] = useState('V1');
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState(
        Array.from({ length: 17 }, (_, i) => ({ label: `V${i + 1}`, value: `V${i + 1}` }))
    );

    return (
        <View style={tw`flex-1 bg-slate-900 p-4`}>
            <Text style={tw`text-white mb-2 text-lg font-bold`}>Grade:</Text>
            <DropDownPicker
                open={open}
                value={grade}
                items={items}
                setOpen={setOpen}
                setValue={setGrade}
                setItems={setItems}
                style={tw`mb-4`}
            />
            <Text style={tw`text-white mb-2 text-lg font-bold`}>Date Completed:</Text>
            <TextInput
                placeholder="Today"
                style={tw`w-full p-3 bg-gray-200 rounded`}
            />
            <View style={tw`flex-row justify-between mt-4`}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={tw`bg-red-500 p-3 rounded`}>
                    <Text style={tw`text-white`}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={tw`bg-green-500 p-3 rounded`}>
                    <Text style={tw`text-white`}>Add</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default AddClimb;
