import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  SafeAreaView, 
  Image, 
  Platform 
} from 'react-native';
import { api } from '../services/api';

export default function HomeScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch user profile
      const profRes = await api.getProfile();
      if (profRes.success) {
        setProfile(profRes.data.user);
      }

      // Fetch expenses
      try {
        const expRes = await api.getExpenses();
        if (expRes.success) {
          setExpenses(expRes.data.expenses || []);
        }
      } catch (e) {
        console.warn('Error fetching expenses:', e.message);
      }

      // Fetch bookings
      try {
        const bookRes = await api.getBookings();
        if (bookRes.success) {
          setBookings(bookRes.data.bookings || []);
        }
      } catch (e) {
        console.warn('Error fetching bookings:', e.message);
      }

    } catch (err) {
      setError(err.message || 'Error connecting to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = () => {
    api.logout();
    navigation.replace('Login');
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Syncing travel records...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTextTitle}>Connection Error</Text>
        <Text style={styles.errorTextDesc}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadData}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutLink} onPress={handleLogout}>
          <Text style={styles.logoutLinkText}>Back to Login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const totalExpenses = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Panel */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image 
            source={{ uri: profile?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150' }} 
            style={styles.avatar} 
          />
          <View>
            <Text style={styles.welcome}>Namaste, {profile?.name}</Text>
            <Text style={styles.role}>{profile?.tier || 'Explorer'}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {/* Profile Card Summary */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Traveler Profile</Text>
          <Text style={styles.bio}>{profile?.bio}</Text>
          <Text style={styles.location}>📍 {profile?.location}</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{profile?.stats?.statesVisited || 0}</Text>
              <Text style={styles.statLabel}>States</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{profile?.stats?.savedTripsCount || 0}</Text>
              <Text style={styles.statLabel}>Trips</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>Lvl {profile?.level || 1}</Text>
              <Text style={styles.statLabel}>{profile?.currentXp}/{profile?.maxXp} XP</Text>
            </View>
          </View>
        </View>

        {/* Bookings Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>Reservations</Text>
            <Text style={styles.countBadge}>{bookings.length} Booked</Text>
          </View>
          {bookings.length === 0 ? (
            <View style={styles.emptyView}>
              <Text style={styles.emptyText}>🎫 No active reservations found</Text>
            </View>
          ) : (
            bookings.map((booking) => (
              <View key={booking.id} style={styles.bookingItem}>
                <Image source={{ uri: booking.image || 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=300' }} style={styles.bookingImage} />
                <View style={styles.bookingDetails}>
                  <Text style={styles.bookingName} numberOfLines={1}>{booking.name}</Text>
                  <Text style={styles.bookingDate} numberOfLines={1}>{booking.dates}</Text>
                  <View style={styles.bookingMeta}>
                    <Text style={styles.bookingPrice}>₹{booking.price?.toLocaleString()}</Text>
                    <Text style={[styles.bookingStatus, booking.status === 'UPCOMING' ? styles.statusUpcoming : {}]}>{booking.status}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Expenses / Splitter Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>Budget Splits</Text>
            <Text style={styles.countBadge}>Total: ₹{totalExpenses.toLocaleString()}</Text>
          </View>
          {expenses.length === 0 ? (
            <View style={styles.emptyView}>
              <Text style={styles.emptyText}>💸 No bill split records found</Text>
            </View>
          ) : (
            expenses.map((expense) => (
              <View key={expense.id} style={styles.expenseItem}>
                <View style={styles.expenseMain}>
                  <Text style={styles.expenseDesc}>{expense.description}</Text>
                  <Text style={styles.expenseMeta}>{expense.category} • {expense.date}</Text>
                </View>
                <View style={styles.expenseRight}>
                  <Text style={styles.expenseAmount}>₹{expense.amount?.toLocaleString()}</Text>
                  <Text style={styles.expensePaid}>Paid by {expense.paidBy}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTextTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorTextDesc: {
    color: '#94a3b8',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
  },
  retryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  logoutLink: {
    marginTop: 20,
  },
  logoutLinkText: {
    color: '#94a3b8',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#1e293b',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: '#2563eb',
  },
  welcome: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  role: {
    color: '#94a3b8',
    fontSize: 11,
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ef444450',
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 11,
    fontWeight: 'bold',
  },
  scrollBody: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  bio: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  location: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 12,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNum: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
  },
  countBadge: {
    color: '#2563eb',
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyView: {
    backgroundColor: 'rgba(15, 23, 42, 0.2)',
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.3)',
    borderStyle: 'dashed',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
  },
  bookingItem: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.2)',
  },
  bookingImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  bookingDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bookingName: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bookingDate: {
    color: '#94a3b8',
    fontSize: 10,
  },
  bookingMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingPrice: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bookingStatus: {
    color: '#64748b',
    fontSize: 8,
    fontWeight: 'bold',
    backgroundColor: 'rgba(100, 116, 139, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  statusUpcoming: {
    color: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.2)',
  },
  expenseMain: {
    flex: 1,
    marginRight: 12,
  },
  expenseDesc: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  expenseLine: {
    color: '#ffffff',
    fontSize: 12,
  },
  expenseMeta: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 2,
  },
  expenseRight: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    color: '#10b981',
    fontSize: 13,
    fontWeight: 'bold',
  },
  expensePaid: {
    color: '#94a3b8',
    fontSize: 9,
    marginTop: 2,
  },
});
