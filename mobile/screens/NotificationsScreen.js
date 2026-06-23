import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import theme from '../theme';
import haptics from '../utils/haptics';

const INITIAL_ALERTS = [
  {
    id: 'n1',
    emoji: '🧭',
    title: 'Jaipur Crowd Timing Alert',
    desc: 'Hawa Mahal crowd density peaks between 11:30 AM and 2:00 PM. We recommend visiting early for sunrise views.',
    time: '2 hrs ago',
    read: false
  },
  {
    id: 'n2',
    emoji: '💸',
    title: 'Split Bill Settled',
    desc: 'Priya Sharma added "Amer Fort Ticket Purchase" (₹1,600). Your equal split is ₹400.',
    time: '4 hrs ago',
    read: false
  },
  {
    id: 'n3',
    emoji: '🎫',
    title: 'Stay Reservation Locked',
    desc: 'Amer Fort Fast-Pass Entry ticket booking ID TNX-PASS-492716 is locked and validated.',
    time: '1 day ago',
    read: true
  },
  {
    id: 'n4',
    emoji: '🚀',
    title: 'Welcome to TourNex',
    desc: 'Your profile has successfully synchronized with the central Firebase project database.',
    time: '2 days ago',
    read: true
  }
];

export default function NotificationsScreen({ navigation }) {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);

  const handleMarkAllRead = () => {
    haptics.selection();
    setAlerts(alerts.map(a => ({ ...a, read: true })));
  };

  const handleClearNotifications = () => {
    haptics.selection();
    setAlerts([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { haptics.selection(); navigation.goBack(); }}>
          <Text style={styles.backLink}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={handleMarkAllRead}>
          <Text style={styles.headerAction}>Read All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {alerts.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>All caught up! No new notifications.</Text>
          </View>
        ) : (
          <View style={styles.cardContainer}>
            {alerts.map((alert) => (
              <View key={alert.id} style={[styles.alertCard, alert.read ? styles.alertCardRead : {}]}>
                <View style={styles.alertLeft}>
                  <Text style={styles.alertEmoji}>{alert.emoji}</Text>
                </View>
                <View style={styles.alertRight}>
                  <View style={styles.alertHeaderRow}>
                    <Text style={[styles.alertTitle, alert.read ? {} : styles.alertTitleUnread]}>{alert.title}</Text>
                    <Text style={styles.alertTime}>{alert.time}</Text>
                  </View>
                  <Text style={styles.alertDesc}>{alert.desc}</Text>
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.clearBtn} onPress={handleClearNotifications}>
              <Text style={styles.clearBtnText}>Wipe Notification Inbox</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  backLink: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  headerAction: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  scrollBody: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: theme.radius.card,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: 20,
    ...theme.shadows.small,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 13,
    color: theme.colors.textMuted,
    fontWeight: '600',
    textAlign: 'center',
  },
  cardContainer: {
    gap: 10,
  },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: theme.radius.card,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
  },
  alertCardRead: {
    opacity: 0.7,
  },
  alertLeft: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: theme.colors.primaryLightest,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alertEmoji: {
    fontSize: 20,
  },
  alertRight: {
    flex: 1,
  },
  alertHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertTitle: {
    fontSize: 13,
    color: theme.colors.text,
    flex: 1,
    marginRight: 8,
  },
  alertTitleUnread: {
    fontWeight: 'bold',
  },
  alertTime: {
    fontSize: 9,
    color: theme.colors.textLight,
    fontFamily: theme.fonts.mono,
  },
  alertDesc: {
    fontSize: 11,
    color: theme.colors.textMuted,
    lineHeight: 16,
  },
  clearBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: theme.radius.button,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.15)',
    marginTop: 10,
  },
  clearBtnText: {
    color: theme.colors.error,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
