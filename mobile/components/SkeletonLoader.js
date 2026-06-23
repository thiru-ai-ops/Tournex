import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import theme from '../theme';

export default function SkeletonLoader({ type = 'card', style }) {
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  if (type === 'avatar') {
    return (
      <Animated.View style={[styles.avatar, { opacity: pulseAnim }, style]} />
    );
  }

  if (type === 'line') {
    return (
      <Animated.View style={[styles.line, { opacity: pulseAnim }, style]} />
    );
  }

  return (
    <Animated.View style={[styles.card, { opacity: pulseAnim }, style]}>
      <View style={styles.cardHeader} />
      <View style={styles.cardBody}>
        <View style={styles.bodyLineLong} />
        <View style={styles.bodyLineShort} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#cbd5e1',
  },
  line: {
    height: 14,
    borderRadius: 6,
    backgroundColor: '#cbd5e1',
    marginVertical: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: theme.radius.card,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardHeader: {
    height: 120,
    borderRadius: theme.radius.card - 4,
    backgroundColor: '#e2e8f0',
    marginBottom: 12,
  },
  cardBody: {
    gap: 8,
  },
  bodyLineLong: {
    height: 16,
    borderRadius: 6,
    backgroundColor: '#e2e8f0',
    width: '80%',
  },
  bodyLineShort: {
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e2e8f0',
    width: '40%',
  },
});
