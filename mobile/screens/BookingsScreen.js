import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { api } from '../services/api';

export default function BookingsScreen() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const bookRes = await api.getBookings();
      if (bookRes.success) {
        setBookings(bookRes.data.bookings || []);
      }
    } catch (e) {
      console.warn('Error fetching bookings:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading && bookings.length === 0) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#2563eb" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.mainTitle}>My Reservations</Text>
          <Text style={styles.mainSub}>Verify your ticket barcodes and active stays</Text>
        </View>

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
    backgroundColor: '#0f172a',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollBody: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  mainTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  mainSub: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 4,
  },
  emptyCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.3)',
    borderStyle: 'dashed',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
  },
  bookingCard: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
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
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 6,
  },
  bookingStat: {
    color: '#64748b',
    fontSize: 8,
    fontWeight: 'bold',
    backgroundColor: 'rgba(100, 116, 139, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  bookingStatGreen: {
    color: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  bookingDates: {
    color: '#cbd5e1',
    fontSize: 10,
    marginTop: 1,
  },
  bookingCode: {
    color: '#64748b',
    fontSize: 9,
    marginTop: 1,
  },
  bookingPrice: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 3,
  },
});
