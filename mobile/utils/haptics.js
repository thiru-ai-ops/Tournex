import { Vibration, Platform } from 'react-native';

export const haptics = {
  // Light touch feedback for selecting a tab, pushing a button, or toggling items
  selection: () => {
    try {
      Vibration.vibrate(Platform.OS === 'ios' ? 1 : 12);
    } catch (e) {
      console.warn('Vibrate not supported', e);
    }
  },
  
  // Notification of successful flow completion (e.g. login, booking successful)
  success: () => {
    try {
      if (Platform.OS === 'ios') {
        Vibration.vibrate(5);
      } else {
        Vibration.vibrate([0, 15, 60, 15]);
      }
    } catch (e) {
      console.warn('Vibrate not supported', e);
    }
  },

  // Notification of error warnings
  error: () => {
    try {
      if (Platform.OS === 'ios') {
        Vibration.vibrate(80);
      } else {
        Vibration.vibrate(120);
      }
    } catch (e) {
      console.warn('Vibrate not supported', e);
    }
  }
};

export default haptics;
