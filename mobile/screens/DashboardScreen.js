import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  RefreshControl, 
  SafeAreaView 
} from 'react-native';
import { api } from '../services/api';
import theme from '../theme';
import haptics from '../utils/haptics';
import SkeletonLoader from '../components/SkeletonLoader';

export default function DashboardScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [profRes, bookRes, expRes] = await Promise.all([
        api.getProfile(),
        api.getBookings(),
        api.getExpenses()
      ]);

      if (profRes.success) setProfile(profRes.data.user);
      if (bookRes.success) setBookings(bookRes.data.bookings || []);
      if (expRes.success) setExpenses(expRes.data.expenses || []);
    } catch (e) {
      console.warn('Dashboard fetch error:', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = () => {
    haptics.selection();
    setRefreshing(true);
    fetchDashboardData();
  };

  const handleQuickAction = (screenName) => {
    haptics.selection();
    navigation.navigate(screenName);
  };

  const totalExpenses = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const nextBooking = bookings[0] || null;

  // Render Skeleton loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <SkeletonLoader type="line" style={{ width: '40%', height: 20 }} />
          <SkeletonLoader type="avatar" style={{ width: 40, height: 40 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollBody}>
          <SkeletonLoader type="card" />
          <SkeletonLoader type="card" />
          <SkeletonLoader type="card" />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Calculate XP percentage
  const xpCurrent = profile?.currentXp || 100;
  const xpMax = profile?.maxXp || 1000;
  const xpPercentage = Math.min(Math.max((xpCurrent / xpMax) * 100, 0), 100);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerWelcome}>Welcome back,</Text>
          <Text style={styles.headerName}>{profile?.name || 'Explorer'}</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => handleQuickAction('Notifications')} style={styles.iconBtn}>
            <Text style={styles.iconEmoji}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleQuickAction('Settings')} style={styles.iconBtn}>
            <Text style={styles.iconEmoji}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollBody} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
        }
      >
        {/* Level Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statsTop}>
            <View>
              <Text style={styles.statTier}>{profile?.tier || 'Explorer Tier'}</Text>
              <Text style={styles.statLevel}>Level {profile?.level || 1}</Text>
            </View>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>⭐ Premium</Text>
            </View>
          </View>
          
          <View style={styles.xpRow}>
            <Text style={styles.xpLabel}>XP Progress</Text>
            <Text style={styles.xpVal}>{xpCurrent}/{xpMax} XP</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${xpPercentage}%` }]} />
          </View>

          <View style={styles.statesVisitedContainer}>
            <View style={styles.visitedBox}>
              <Text style={styles.visitedNum}>{profile?.stats?.statesVisited || 0}</Text>
              <Text style={styles.visitedLabel}>States Visited</Text>
            </View>
            <View style={styles.dividerCol} />
            <View style={styles.visitedBox}>
              <Text style={styles.visitedNum}>{bookings.length}</Text>
              <Text style={styles.visitedLabel}>Reservations</Text>
            </View>
            <View style={styles.dividerCol} />
            <View style={styles.visitedBox}>
              <Text style={styles.visitedNum}>{profile?.stats?.reviewsCount || 0}</Text>
              <Text style={styles.visitedLabel}>Reviews</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions Shortcuts */}
        <Text style={styles.sectionTitle}>Shortcuts</Text>
        <View style={styles.shortcutsRow}>
          <TouchableOpacity style={styles.shortcutBtn} onPress={() => navigation.navigate('Explore')}>
            <Text style={styles.shortcutEmoji}>🧭</Text>
            <Text style={styles.shortcutText}>Explore</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shortcutBtn} onPress={() => navigation.navigate('Chat')}>
            <Text style={styles.shortcutEmoji}>💬</Text>
            <Text style={styles.shortcutText}>AI Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shortcutBtn} onPress={() => navigation.navigate('Splitter')}>
            <Text style={styles.shortcutEmoji}>💸</Text>
            <Text style={styles.shortcutText}>Split Ledger</Text>
          </TouchableOpacity>
        </View>

        {/* Next Reservation Card Preview */}
        <Text style={styles.sectionTitle}>Upcoming Reservation</Text>
        {nextBooking ? (
          <TouchableOpacity 
            style={styles.bookingCard} 
            onPress={() => navigation.navigate('Bookings')}
          >
            <Image source={{ uri: nextBooking.image }} style={styles.bookingImg} />
            <View style={styles.bookingContent}>
              <Text style={styles.bookingTitle} numberOfLines={1}>{nextBooking.name}</Text>
              <Text style={styles.bookingDate}>{nextBooking.dates}</Text>
              <Text style={styles.bookingCode}>Code: {nextBooking.bookingId}</Text>
            </View>
            <Text style={styles.bookingPrice}>₹{nextBooking.price?.toLocaleString()}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>🎫 No upcoming reservations registered</Text>
          </View>
        )}

        {/* Split Ledger Summary Card */}
        <Text style={styles.sectionTitle}>Expense Ledger</Text>
        <View style={styles.ledgerCard}>
          <View style={styles.ledgerLeft}>
            <Text style={styles.ledgerHeading}>Group Travel Balance</Text>
            <Text style={styles.ledgerAmount}>₹{totalExpenses.toLocaleString()}</Text>
            <Text style={styles.ledgerSubtitle}>Logged over {expenses.length} transaction entries</Text>
          </View>
          <TouchableOpacity style={styles.ledgerBtn} onPress={() => navigation.navigate('Splitter')}>
            <Text style={styles.ledgerBtnText}>View</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  headerWelcome: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
  headerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primaryLightest,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primaryLight,
  },
  iconEmoji: {
    fontSize: 16,
  },
  scrollBody: {
    padding: 16,
    paddingBottom: 32,
  },
  statsCard: {
    backgroundColor: '#ffffff',
    borderRadius: theme.radius.card,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
    marginBottom: 20,
  },
  statsTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  statTier: {
    fontSize: 11,
    color: theme.colors.textLight,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  statLevel: {
    fontSize: 22,
    fontWeight: 'black',
    color: theme.colors.text,
  },
  badgeContainer: {
    backgroundColor: theme.colors.primaryLightest,
    borderWidth: 1,
    borderColor: theme.colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 10,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  xpLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
  xpVal: {
    fontSize: 11,
    fontFamily: theme.fonts.mono,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  statesVisitedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLightest,
    borderRadius: theme.radius.card - 4,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: theme.colors.primaryLight,
  },
  visitedBox: {
    alignItems: 'center',
    flex: 1,
  },
  visitedNum: {
    fontSize: 18,
    fontWeight: 'black',
    color: theme.colors.text,
  },
  visitedLabel: {
    fontSize: 9,
    color: theme.colors.textMuted,
    fontWeight: '600',
    marginTop: 2,
  },
  dividerCol: {
    width: 1,
    height: 30,
    backgroundColor: theme.colors.primaryLight,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 10,
    marginTop: 6,
  },
  shortcutsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  shortcutBtn: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: theme.radius.card,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
  },
  shortcutEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  shortcutText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  bookingCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: theme.radius.card,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
    marginBottom: 20,
  },
  bookingImg: {
    width: 52,
    height: 52,
    borderRadius: 8,
    marginRight: 12,
  },
  bookingContent: {
    flex: 1,
    justifyContent: 'center',
  },
  bookingTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  bookingDate: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 1,
  },
  bookingCode: {
    fontSize: 9,
    color: theme.colors.textLight,
    marginTop: 1,
  },
  bookingPrice: {
    fontSize: 13,
    fontWeight: 'black',
    color: theme.colors.primary,
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: theme.radius.card,
    paddingVertical: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  emptyText: {
    color: theme.colors.textLight,
    fontSize: 12,
    fontWeight: '600',
  },
  ledgerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: theme.radius.card,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
    marginBottom: 12,
  },
  ledgerLeft: {
    flex: 1,
  },
  ledgerHeading: {
    fontSize: 12,
    color: theme.colors.textLight,
    fontWeight: 'bold',
  },
  ledgerAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.success,
    marginVertical: 2,
  },
  ledgerSubtitle: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  ledgerBtn: {
    backgroundColor: theme.colors.primaryLightest,
    borderWidth: 1,
    borderColor: theme.colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  ledgerBtnText: {
    fontSize: 11,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});
