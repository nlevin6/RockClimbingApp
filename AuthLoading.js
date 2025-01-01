import React, {useEffect} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {getAuth, onAuthStateChanged} from "firebase/auth";
import tw from './tailwind';

const AuthLoading = () => {
    const navigation = useNavigation();
    const auth = getAuth();

    useEffect(() => {
        return onAuthStateChanged(auth, (user) => {
            if (user) {
                navigation.reset({index: 0, routes: [{name: 'Home'}]});
            } else {
                navigation.reset({index: 0, routes: [{name: 'Login'}]});
            }
        });
    }, [navigation]);

    return (
        <View style={tw`flex-1 justify-center items-center bg-slate-900`}>
            <ActivityIndicator size="large" color="#7C3AED" />
        </View>
    );
};

export default AuthLoading;
