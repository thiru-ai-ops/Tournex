import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { BACKEND_IP, BACKEND_PORT } from './config';

import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import BookingsScreen from './screens/BookingsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  // Query backend Firebase alignment telemetry on boot
  useEffect(() => {
    const fetchFirebaseStatus = async () => {
      try {
        const response = await fetch(`http://${BACKEND_IP}:${BACKEND_PORT}/`);
        const json = await response.json();
        if (json && json.success) {
          const data = json.data || json;
          console.log("Connected Project ID:", data.projectId);
          console.log("Firestore database status:", data.firestoreStatus);
          console.log("Authentication status:", data.authStatus);
        } else {
          console.warn("Failed to fetch Firebase status from backend: invalid response format");
        }
      } catch (error) {
        console.error("Error connecting to backend Firebase status health check:", error.message);
      }
    };
    fetchFirebaseStatus();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <Stack.Navigator 
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#f8fafc' }
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Bookings" component={BookingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
