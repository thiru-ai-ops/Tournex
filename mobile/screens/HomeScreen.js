import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text } from 'react-native';

import ExploreScreen from './ExploreScreen';
import ChatScreen from './ChatScreen';
import SplitterScreen from './SplitterScreen';
import BookingsScreen from './BookingsScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

export default function HomeScreen({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#1e293b',
          borderTopWidth: 1,
          borderColor: '#334155',
          paddingBottom: 6,
          paddingTop: 6,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
        tabBarIcon: ({ color, size }) => {
          let icon = '🧭';
          if (route.name === 'Explore') icon = '🧭';
          else if (route.name === 'Chat') icon = '💬';
          else if (route.name === 'Splitter') icon = '💸';
          else if (route.name === 'Bookings') icon = '🎫';
          else if (route.name === 'Profile') icon = '👤';

          return <Text style={{ fontSize: 18, color }}>{icon}</Text>;
        },
      })}
    >
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Splitter" component={SplitterScreen} />
      <Tab.Screen name="Bookings" component={BookingsScreen} />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        // Pass navigation prop to Profile screen for stack replacing (logout)
        listeners={({ navigation }) => ({
          focus: () => {
            // Can be used to run callbacks on focus
          }
        })}
      />
    </Tab.Navigator>
  );
}
