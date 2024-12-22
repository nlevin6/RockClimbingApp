import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Home from '../Home';
import ManageClimb from '../ManageClimb';
import Settings from '../Settings';

const Tab = createBottomTabNavigator();

const BottomNav = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = 'home';
                    } else if (route.name === 'Manage Climbs') {
                        iconName = 'add-circle';
                    } else if (route.name === 'Settings') {
                        iconName = 'settings';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'rgb(124, 58, 237)',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    backgroundColor: 'rgb(15, 23, 42)',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderTopWidth: 0,
                },
                headerShown: false,
            })}
        >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Manage Climbs" component={ManageClimb} />
            <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>
    );
};

export default BottomNav;
