import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Image } from 'react-native';
import { api } from '../services/api';
import theme from '../theme';
import haptics from '../utils/haptics';

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Micro haptic feedback on launch
    haptics.selection();

    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 15,
        friction: 6,
        useNativeDriver: true,
      })
    ]).start();

    // Auto auth or navigation route resolver
    const resolveInitialRoute = async () => {
      // Simulate splash display minimum duration
      await new Promise(resolve => setTimeout(resolve, 1800));

      try {
        const res = await api.getProfile();
        if (res.success && res.data?.user) {
          navigation.replace('Home');
          return;
        }
      } catch (err) {
        console.log('SplashScreen session validation status: No active login session found.');
      }
      navigation.replace('Onboarding');
    };

    resolveInitialRoute();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoBox, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.logoBadge}>
          {/* Landmark Building Logo Mock Representation */}
          <Text style={styles.logoIcon}>🏛️</Text>
        </View>
        <Text style={styles.logoTitle}>
          Tour<Text style={styles.logoAccent}>Nex</Text>
        </Text>
        <Text style={styles.logoSub}>AI TRAVEL ENGINE</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBox: {
    alignItems: 'center',
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  logoIcon: {
    fontSize: 40,
    color: '#ffffff',
  },
  logoTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  logoAccent: {
    color: theme.colors.primary,
  },
  logoSub: {
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: theme.fonts.mono,
    color: theme.colors.textLight,
    letterSpacing: 3,
    marginTop: 6,
  },
});
