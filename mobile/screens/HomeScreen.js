import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text } from 'react-native';
import theme from '../theme';
import haptics from '../utils/haptics';

import DashboardScreen from './DashboardScreen';
import ExploreScreen from './ExploreScreen';
import ChatScreen from './ChatScreen';
import SplitterScreen from './SplitterScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

export default function HomeScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderColor: theme.colors.border,
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
          if (route.name === 'Dashboard') icon = '🏠';
          else if (route.name === 'Explore') icon = '🧭';
          else if (route.name === 'Chat') icon = '💬';
          else if (route.name === 'Splitter') icon = '💸';
          else if (route.name === 'Profile') icon = '👤';

          return <Text style={{ fontSize: 18, color }}>{icon}</Text>;
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        listeners={{
          tabPress: () => haptics.selection(),
        }}
      />
      <Tab.Screen 
        name="Explore" 
        component={ExploreScreen} 
        listeners={{
          tabPress: () => haptics.selection(),
        }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen} 
        listeners={{
          tabPress: () => haptics.selection(),
        }}
      />
      <Tab.Screen 
        name="Splitter" 
        component={SplitterScreen} 
        listeners={{
          tabPress: () => haptics.selection(),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        listeners={{
          tabPress: () => haptics.selection(),
        }}
      />
    </Tab.Navigator>
  );
}
