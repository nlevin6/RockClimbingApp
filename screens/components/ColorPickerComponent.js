import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Image, Pressable, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import { ColorWheel } from 'react-native-color-wheel';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { nanoid } from 'nanoid/non-secure';
import tw from '../../tailwind';
import { useGradingSystem } from './GradingContext';
import { debounce } from 'lodash';

const ColorPickerComponent = () => {
    const { chromaticGrades, setChromaticGrades } = useGradingSystem();
    const [color, setColor] = useState('#ffffff');
    const [tempColor, setTempColor] = useState({ h: 0, s: 100, v: 100 });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedColorIndex, setSelectedColorIndex] = useState(null);
    const [localSaturation, setLocalSaturation] = useState(tempColor.s);
    const [localBrightness, setLocalBrightness] = useState(tempColor.v);

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    const handleColorChange = useRef(debounce((selectedColor) => {
        if (selectedColor) {
            setTempColor((prev) => ({
                ...prev,
                h: selectedColor.h,
            }));
        }
    }, 100)).current;

    const handleSaturationChange = (value) => {
        setLocalSaturation(value);
        debounceSaturationChange(value);
    };

    const debounceSaturationChange = useRef(debounce((value) => {
        setTempColor((prev) => ({
            ...prev,
            s: value,
        }));
    }, 100)).current;

    const handleBrightnessChange = (value) => {
        setLocalBrightness(value);
        debounceBrightnessChange(value);
    };

    const debounceBrightnessChange = useRef(debounce((value) => {
        setTempColor((prev) => ({
            ...prev,
            v: value,
        }));
    }, 100)).current;

    const handleSelectColor = () => {
        const hexColor = hsvToHex(tempColor.h, tempColor.s, tempColor.v);
        setColor(hexColor);
        toggleModal();
    };

    const addColorToBar = () => {
        if (chromaticGrades.some((item) => item.color.toLowerCase() === color.toLowerCase())) {
            Alert.alert('Error', 'This color already exists');
            return;
        }
        if (chromaticGrades.length < 13) {
            const uniqueKey = nanoid();
            setChromaticGrades([...chromaticGrades, { key: uniqueKey, color }]);
        } else {
            Alert.alert('Limit Reached', 'You can only have up to 13 chromatic grades.');
        }
    };

    const handleColorPress = (index) => {
        setSelectedColorIndex(index);
    };

    const deleteSelectedColor = () => {
        if (selectedColorIndex !== null) {
            const updatedColorBar = chromaticGrades.filter((_, index) => index !== selectedColorIndex);
            setChromaticGrades(updatedColorBar.map((item) => ({ ...item, key: nanoid() })));
            setSelectedColorIndex(null);
        }
    };

    const handleBackgroundPress = () => {
        setSelectedColorIndex(null);
    };

    const calculateBlockSize = () => {
        const maxWidth = 320;
        const blockCount = chromaticGrades.length;
        const blockSize = blockCount > 0 ? Math.min(40, Math.floor(maxWidth / blockCount) - 4) : 40;
        return Math.max(20, blockSize);
    };

    const blockSize = calculateBlockSize();

    const onDragEnd = ({ data }) => {
        const updatedData = data.map((item) => ({ ...item, key: nanoid() }));
        setChromaticGrades(updatedData);
    };

    return (
        <Pressable style={tw`p-4 bg-slate-900`} onPress={handleBackgroundPress}>
            <DraggableFlatList
                data={chromaticGrades}
                renderItem={({ item, drag, isActive }) => (
                    <TouchableOpacity
                        onLongPress={drag}
                        onPress={() => handleColorPress(chromaticGrades.indexOf(item))}
                        disabled={isActive}
                        style={[
                            styles.colorBlock,
                            { backgroundColor: item.color, width: blockSize, height: blockSize }
                        ]}
                    />
                )}
                keyExtractor={(item) => item.key}
                onDragEnd={onDragEnd}
                horizontal
                scrollEnabled={false}
                contentContainerStyle={styles.colorBarContainer}
            />
            {selectedColorIndex !== null && (
                <TouchableOpacity
                    style={tw`mt-2 mb-4 bg-red-600 p-2 rounded w-full px-4 py-2 mx-auto rounded-2xl`}
                    onPress={deleteSelectedColor}
                >
                    <Text style={tw`text-white font-bold text-center text-sm`}>Delete Grade</Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity
                style={[styles.colorBox, { backgroundColor: color }]}
                onPress={toggleModal}
            />
            <TouchableOpacity
                style={tw`mt-4 bg-violet-700 p-2 rounded w-full px-4 py-2 mx-auto rounded-2xl`}
                onPress={addColorToBar}
            >
                <Text style={tw`text-white font-bold text-center text-sm`}>Add Grade</Text>
            </TouchableOpacity>
            <Modal visible={isModalVisible} transparent={true} animationType="slide">
                <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
                    <View style={tw`w-4/5 bg-slate-900 border border-violet-700 p-4 rounded-lg items-center`}>
                        <View
                            style={[
                                styles.colorDisplay,
                                { backgroundColor: hsvToHex(tempColor.h, tempColor.s, tempColor.v) }
                            ]}
                        />
                        <Text style={tw`text-violet-200 font-bold text-center`}>Saturation</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={100}
                            step={1}
                            value={tempColor.s}
                            onValueChange={handleSaturationChange}
                            minimumTrackTintColor="rgb(167, 139, 250)"
                            maximumTrackTintColor="#ddd"
                            thumbTintColor="rgb(109, 40, 217)"
                        />
                        <Text style={tw`text-violet-200 font-bold text-center mt-4`}>Brightness</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={100}
                            step={1}
                            value={tempColor.v}
                            onValueChange={handleBrightnessChange}
                            minimumTrackTintColor="rgb(167, 139, 250)"
                            maximumTrackTintColor="#ddd"
                            thumbTintColor="rgb(109, 40, 217)"
                        />
                        <View style={styles.colorWheelContainer}>
                            <Image
                                source={require('../../assets/rgb_color_wheel.png')}
                                style={styles.colorWheelImage}
                            />
                            <ColorWheel
                                initialColor={hsvToHex(tempColor.h, tempColor.s, tempColor.v)}
                                onColorChange={handleColorChange}
                                onColorChangeComplete={handleColorChange}
                                style={styles.colorWheel}
                                thumbStyle={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 15,
                                    backgroundColor: '#fff',
                                    borderWidth: 2,
                                    borderColor: '#000',
                                }}
                            />
                        </View>
                        <TouchableOpacity
                            style={tw`mt-4 bg-violet-600 p-2 rounded w-full px-4 py-2 mx-2 rounded-2xl`}
                            onPress={handleSelectColor}
                        >
                            <Text style={tw`text-white font-bold text-center text-sm`}>Select Color</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={tw`mt-4 bg-red-600 p-2 rounded w-full px-4 py-2 mx-2 rounded-2xl`}
                            onPress={toggleModal}
                        >
                            <Text style={tw`text-white font-bold text-center text-sm`}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </Pressable>
    );
};

const hsvToHex = (h, s, v) => {
    h = h % 360;
    if (h < 0) h += 360;
    s = s / 100;
    v = v / 100;
    let c = v * s;
    let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    let m = v - c;
    let r1, g1, b1;
    if (h >= 0 && h < 60) {
        r1 = c;
        g1 = x;
        b1 = 0;
    } else if (h >= 60 && h < 120) {
        r1 = x;
        g1 = c;
        b1 = 0;
    } else if (h >= 120 && h < 180) {
        r1 = 0;
        g1 = c;
        b1 = x;
    } else if (h >= 180 && h < 240) {
        r1 = 0;
        g1 = x;
        b1 = c;
    } else if (h >= 240 && h < 300) {
        r1 = x;
        g1 = 0;
        b1 = c;
    } else {
        r1 = c;
        g1 = 0;
        b1 = x;
    }
    const r = Math.round((r1 + m) * 255);
    const g = Math.round((g1 + m) * 255);
    const b = Math.round((b1 + m) * 255);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const styles = StyleSheet.create({
    colorBox: {
        padding: 16,
        borderRadius: 16,
        width: '100%',
        height: 100,
    },
    colorDisplay: {
        width: '100%',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#000',
        marginBottom: 16,
    },
    slider: {
        width: '80%',
        height: 40,
    },
    colorWheelContainer: {
        width: 300,
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    colorWheelImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 150,
    },
    colorWheel: {
        width: '100%',
        height: '100%',
    },
    colorBarContainer: {
        flexDirection: 'row',
        marginVertical: 10,
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'center',
    },
    colorBlock: {
        marginHorizontal: 4,
        borderRadius: 8,
    },
});

export default ColorPickerComponent;
