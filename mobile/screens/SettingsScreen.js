import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import theme from '../theme';
import haptics from '../utils/haptics';
import { BACKEND_IP, BACKEND_PORT } from '../config';
import { api } from '../services/api';

export default function SettingsScreen({ navigation }) {
  const [offlineSimulation, setOfflineSimulation] = useState(api.isOfflineMode());
  const [darkModeSim, setDarkModeSim] = useState(false);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  const handleToggleOffline = (val) => {
    haptics.selection();
    setOfflineSimulation(val);
    Alert.alert(
      'Network Simulator Changed',
      val ? 'Switched to Offline Sandbox Mode. API requests will be intercepted locally.' : 'Re-established online Express backend gateway sync.'
    );
  };

  const handleToggleDarkMode = (val) => {
    haptics.selection();
    setDarkModeSim(val);
    Alert.alert('Branding Notice', 'TourNex theme locked to consistent brand light-mode color palette matching the main web site.');
  };

  const handleClearCache = () => {
    haptics.selection();
    Alert.alert('Cache Cleared', 'Simulated regional map tiles and guide certificates wiped successfully.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { haptics.selection(); navigation.goBack(); }}>
          <Text style={styles.backLink}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>System Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeading}>Travel Simulator Settings</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>Offline Simulator Mode</Text>
              <Text style={styles.rowSubtitle}>Intercept network operations locally</Text>
            </View>
            <Switch 
              value={offlineSimulation} 
              onValueChange={handleToggleOffline} 
              trackColor={{ true: theme.colors.primary, false: theme.colors.border }}
              thumbColor="#ffffff"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>Simulated Dark Theme</Text>
              <Text style={styles.rowSubtitle}>Align app elements with dark palette</Text>
            </View>
            <Switch 
              value={darkModeSim} 
              onValueChange={handleToggleDarkMode}
              trackColor={{ true: theme.colors.primary, false: theme.colors.border }}
              thumbColor="#ffffff"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>Haptic Feedback Tick</Text>
              <Text style={styles.rowSubtitle}>Subtle haptic tap on button presses</Text>
            </View>
            <Switch 
              value={hapticsEnabled} 
              onValueChange={(val) => { haptics.selection(); setHapticsEnabled(val); }}
              trackColor={{ true: theme.colors.primary, false: theme.colors.border }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        <Text style={styles.sectionHeading}>Data Controls</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.actionRow} onPress={handleClearCache}>
            <Text style={styles.actionText}>Clear Offline Cached Tiles</Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionHeading}>Network telemetry</Text>
        <View style={styles.card}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>API Gateway IP</Text>
            <Text style={styles.metaVal}>{BACKEND_IP}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>API Gateway Port</Text>
            <Text style={styles.metaVal}>{BACKEND_PORT}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Active Endpoint</Text>
            <Text style={styles.metaVal}>http://{BACKEND_IP}:{BACKEND_PORT}/</Text>
          </View>
        </View>

        <Text style={styles.copyNotice}>TourNex Mobile Companion • Version 2.0.0</Text>
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
  scrollBody: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: 'bold',
    color: theme.colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginTop: 18,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
    ...theme.shadows.small,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLeft: {
    flex: 1,
    marginRight: 10,
  },
  rowTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  rowSubtitle: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 14,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: theme.colors.error,
  },
  actionArrow: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  metaLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  metaVal: {
    fontSize: 12,
    color: theme.colors.text,
    fontFamily: theme.fonts.mono,
  },
  copyNotice: {
    textAlign: 'center',
    fontSize: 10,
    color: theme.colors.textLight,
    marginTop: 30,
  },
});
