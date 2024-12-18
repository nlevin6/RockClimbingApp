import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import Login from './screens/Login';
import BottomNav from './screens/components/BottomNav';
import { LogBox } from 'react-native';

if (__DEV__) {
    LogBox.ignoreLogs([
        'Support for defaultProps',
    ]);
}

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <StatusBar style="light" />
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Home"
                    component={BottomNav}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
