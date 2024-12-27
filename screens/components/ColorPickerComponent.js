import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Image } from 'react-native';
import { ColorWheel } from 'react-native-color-wheel';
import tw from '../../tailwind';

const ColorPickerComponent = () => {
    const [color, setColor] = useState('#ffffff');
    const [tempColor, setTempColor] = useState('#ffffff');
    const [isModalVisible, setIsModalVisible] = useState(false);

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    const handleColorChange = (selectedColor) => {
        if (selectedColor) {
            const hexColor = hsvToHex(selectedColor.h, selectedColor.s, selectedColor.v);
            setTempColor(hexColor);
        }
    };

    const handleSelectColor = () => {
        if (tempColor) {
            setColor(tempColor);
        }
        toggleModal();
    };

    return (
        <View style={tw`flex-1 p-4 bg-slate-900`}>
            <TouchableOpacity
                style={[styles.colorBox, { backgroundColor: color }]}
                onPress={toggleModal}
            />
            <Modal visible={isModalVisible} transparent={true} animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: tempColor }]}>
                        <Text style={tw`text-black font-bold text-lg mb-4`}>Pick a Color</Text>
                        <View style={styles.colorWheelContainer}>
                            <Image
                                source={require('../../assets/rgb_color_wheel.png')}
                                style={styles.colorWheelImage}
                            />
                            <ColorWheel
                                initialColor={color}
                                onColorChange={handleColorChange}
                                onColorChangeComplete={handleColorChange}
                                style={styles.colorWheel}
                                thumbStyle={styles.colorThumb}
                            />
                        </View>
                        <TouchableOpacity
                            style={[tw`mt-4 p-2 rounded`, { backgroundColor: '#4CAF50' }]}
                            onPress={handleSelectColor}
                        >
                            <Text style={tw`text-white font-bold text-center`}>Select Color</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[tw`mt-4 p-2 rounded`, { backgroundColor: '#F44336' }]}
                            onPress={toggleModal}
                        >
                            <Text style={tw`text-white font-bold text-center`}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
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
        width: 100,
        height: 100,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        width: '80%',
    },
    colorWheelContainer: {
        width: 300,
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
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
    colorThumb: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#000',
    },
});

export default ColorPickerComponent;
