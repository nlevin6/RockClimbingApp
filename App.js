import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './screens/Login';
import BottomNav from './screens/components/BottomNav';
import { LogBox } from 'react-native';

if (__DEV__) {
    LogBox.ignoreLogs([
        'Support for defaultProps', // Ignore specific warning
    ]);
}

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                {/* Login Screen */}
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ headerShown: false }}
                />
                {/* Bottom Navigation */}
                <Stack.Screen
                    name="Home"
                    component={BottomNav}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
