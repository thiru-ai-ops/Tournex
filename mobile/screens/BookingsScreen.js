import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  ActivityIndicator,
  RefreshControl,
  SafeAreaView
} from 'react-native';
import { api } from '../services/api';
import theme from '../theme';
import haptics from '../utils/haptics';
import SkeletonLoader from '../components/SkeletonLoader';

export default function BookingsScreen() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async () => {
    try {
      const bookRes = await api.getBookings();
      if (bookRes.success) {
        setBookings(bookRes.data.bookings || []);
      }
    } catch (e) {
      console.warn('Error fetching bookings:', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchBookings();
  }, []);

  const onRefresh = () => {
    haptics.selection();
    setRefreshing(true);
    fetchBookings();
  };

  if (loading && bookings.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollBody}>
          <SkeletonLoader type="card" />
          <SkeletonLoader type="card" />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Panel */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>My Reservations</Text>
        <Text style={styles.pageSubtitle}>Verify your ticket barcodes and active stays</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollBody} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
        }
      >
        {bookings.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>🎫 No active reservations registered yet</Text>
          </View>
        ) : (
          bookings.map((booking) => (
            <View key={booking.id} style={styles.bookingCard}>
              <Image source={{ uri: booking.image || 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=300' }} style={styles.bookingImg} />
              <View style={styles.bookingContent}>
                <View style={styles.bookingTitleRow}>
                  <Text style={styles.bookingName} numberOfLines={1}>{booking.name}</Text>
                  <Text style={[styles.bookingStat, booking.status === 'UPCOMING' ? styles.bookingStatGreen : {}]}>{booking.status}</Text>
                </View>
                <Text style={styles.bookingDates}>{booking.dates}</Text>
                <Text style={styles.bookingCode}>Code: {booking.bookingId}</Text>
                <Text style={styles.bookingPrice}>₹{booking.price?.toLocaleString()}</Text>
              </View>
            </View>
          ))
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
  pageHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  pageSubtitle: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  scrollBody: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: theme.radius.card,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  emptyText: {
    color: theme.colors.textLight,
    fontSize: 12,
    fontWeight: '600',
  },
  bookingCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: theme.radius.card,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
  },
  bookingImg: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
  },
  bookingContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bookingTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingName: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 6,
  },
  bookingStat: {
    color: theme.colors.textMuted,
    fontSize: 8,
    fontWeight: 'bold',
    backgroundColor: 'rgba(100, 116, 139, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  bookingStatGreen: {
    color: theme.colors.success,
    backgroundColor: theme.colors.successBg,
  },
  bookingDates: {
    color: theme.colors.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  bookingCode: {
    color: theme.colors.textLight,
    fontSize: 9,
    marginTop: 1,
  },
  bookingPrice: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 3,
  },
});
