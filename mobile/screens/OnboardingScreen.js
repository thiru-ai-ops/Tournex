import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import theme from '../theme';
import haptics from '../utils/haptics';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    icon: '🧭',
    title: 'Explore ASI Monuments',
    desc: 'Access regulated entry insights, crowd timings, and accredited partner resorts in real-time.'
  },
  {
    icon: '💬',
    title: 'AI Travel Companion',
    desc: 'Get prompt recommendations on local dining hotspots, timing parameters, and regional guides.'
  },
  {
    icon: '💸',
    title: 'Seamless Group Billing',
    desc: 'Log transit expenses, split tabs equally, and keep tabs of mutual group accounts transparently.'
  }
];

export default function OnboardingScreen({ navigation }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    haptics.selection();
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigation.replace('Login');
    }
  };

  const handleSkip = () => {
    haptics.selection();
    navigation.replace('Login');
  };

  const slide = SLIDES[currentSlide];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <Text style={styles.icon}>{slide.icon}</Text>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.desc}>{slide.desc}</Text>
      </View>

      <View style={styles.footer}>
        {/* Progress indicator dots */}
        <View style={styles.indicatorRow}>
          {SLIDES.map((_, i) => (
            <View 
              key={i} 
              style={[
                styles.dot, 
                currentSlide === i ? styles.dotActive : {}
              ]} 
            />
          ))}
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.actionBtn} onPress={handleNext}>
          <Text style={styles.actionBtnText}>
            {currentSlide === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
  },
  header: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  skipText: {
    color: theme.colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  icon: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  desc: {
    fontSize: 14,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    height: 120,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 24,
  },
  indicatorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
  },
  dotActive: {
    width: 24,
    backgroundColor: theme.colors.primary,
  },
  actionBtn: {
    width: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.button,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
