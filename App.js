import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import Login from './screens/Login';
import BottomNav from './screens/components/BottomNav';
import ChangePassword from './screens/components/ChangePassword';
import { LogBox } from 'react-native';
import { GradingProvider } from './screens/components/GradingContext';

if (__DEV__) {
    LogBox.ignoreLogs([
        'Support for defaultProps',
    ]);
}

const Stack = createStackNavigator();

export default function App() {
    return (
        <GradingProvider>
            <NavigationContainer>
                <StatusBar style="light" />
                <Stack.Navigator initialRouteName="Login">
                    <Stack.Screen
                        name="Login"
                        component={Login}
                        options={{
                            headerShown: false,
                            gestureEnabled: false,
                        }}
                    />
                    <Stack.Screen
                        name="Home"
                        component={BottomNav}
                        options={{
                            headerShown: false,
                            gestureEnabled: false,
                        }}
                    />
                    <Stack.Screen
                        name="ChangePassword"
                        component={ChangePassword}
                        options={{
                            headerShown: false,
                        }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </GradingProvider>
    );
}
