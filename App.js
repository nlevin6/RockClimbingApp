import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {StatusBar} from 'expo-status-bar';
import Login from './screens/Login';
import BottomNav from './screens/components/BottomNav';
import ChangePassword from './screens/components/ChangePassword';
import {LogBox} from 'react-native';
import {GradingProvider} from './screens/components/GradingContext';
import ForgotPassword from "./screens/components/ForgotPassword";
import AuthLoading from './AuthLoading';

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
                <StatusBar style="light"/>
                <Stack.Navigator initialRouteName="AuthLoading">
                    <Stack.Screen
                        name="AuthLoading"
                        component={AuthLoading}
                        options={{ headerShown: false }}
                    />
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
                    <Stack.Screen
                        name="ForgotPassword"
                        component={ForgotPassword}
                        options={{
                            headerShown: false,
                        }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </GradingProvider>
    );
}
