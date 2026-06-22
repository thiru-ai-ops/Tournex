import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Alert,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { api } from '../services/api';
import { ALL_DESTINATIONS } from '../data';

export default function ExploreScreen() {
  const [selectedDest, setSelectedDest] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleBookHotel = async (hotel) => {
    const randomId = `TNX-STAY-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBooking = {
      id: `booking-${Date.now()}`,
      name: `Luxury Stay at ${hotel.name}`,
      status: 'UPCOMING',
      dates: `Next Week • 3 Nights (1 Room)`,
      price: hotel.price * 3,
      bookingId: randomId,
      image: hotel.image
    };
    try {
      setLoading(true);
      await api.addBooking(newBooking);
      Alert.alert('Reservation Locked', `Successfully booked ${hotel.name}. Booking ID: ${randomId}`);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookPackage = async (destination) => {
    const randomId = `TNX-PKHST-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBooking = {
      id: `booking-${Date.now()}`,
      name: `Premium Package Tour in ${destination.name}`,
      status: 'UPCOMING',
      dates: `Next Week • 4 Days & 4 Nights (1 Room)`,
      price: destination.estMinBudget * 2,
      bookingId: randomId,
      image: destination.image
    };
    try {
      setLoading(true);
      await api.addBooking(newBooking);
      Alert.alert('Package Registered', `Successfully booked ${destination.name} Package. Booking ID: ${randomId}`);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#2563eb" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {selectedDest ? (
        <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setSelectedDest(null)}>
            <Text style={styles.backBtnText}>← Back to Destinations</Text>
          </TouchableOpacity>
          <Image source={{ uri: selectedDest.image }} style={styles.detailImage} />
          
          <View style={styles.detailCard}>
            <View style={styles.detailTitleRow}>
              <Text style={styles.detailTitle}>{selectedDest.name}</Text>
              <Text style={styles.detailState}>{selectedDest.state}</Text>
            </View>
            <Text style={styles.detailCategory}>{selectedDest.category} • ⭐ {selectedDest.rating}</Text>
            <Text style={styles.detailDesc}>{selectedDest.description}</Text>

            <TouchableOpacity style={styles.pkgBtn} onPress={() => handleBookPackage(selectedDest)}>
              <Text style={styles.pkgBtnText}>Book Premium Tour Package (₹{(selectedDest.estMinBudget * 2).toLocaleString()})</Text>
            </TouchableOpacity>

            {/* Monuments Section */}
            <Text style={styles.subTitle}>ASI Monuments & Sights</Text>
            {selectedDest.touristSpots?.map((spot, i) => (
              <View key={i} style={styles.spotItem}>
                <Image source={{ uri: spot.image }} style={styles.spotImage} />
                <View style={styles.spotInfo}>
                  <Text style={styles.spotName}>{spot.name}</Text>
                  <Text style={styles.spotDesc}>{spot.description}</Text>
                </View>
              </View>
            ))}

            {/* Stays Section */}
            <Text style={styles.subTitle}>Accredited Stays & Resorts</Text>
            {selectedDest.hotels?.map((hotel) => (
              <View key={hotel.id} style={styles.hotelItem}>
                <Image source={{ uri: hotel.image }} style={styles.hotelImage} />
                <View style={styles.hotelInfo}>
                  <Text style={styles.hotelName}>{hotel.name}</Text>
                  <Text style={styles.hotelLoc}>📍 {hotel.location}</Text>
                  <Text style={styles.hotelRate}>⭐ {hotel.rating} • ₹{hotel.price.toLocaleString()}/night</Text>
                  <TouchableOpacity style={styles.hotelBookBtn} onPress={() => handleBookHotel(hotel)}>
                    <Text style={styles.hotelBookBtnText}>Book Stay (3 Nights)</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
          <View style={styles.sectionHeader}>
            <Text style={styles.mainTitle}>Explore India</Text>
            <Text style={styles.mainSub}>Regulated ASI sites and partner resorts</Text>
          </View>

          {ALL_DESTINATIONS.map((dest) => (
            <TouchableOpacity key={dest.id} style={styles.destCard} onPress={() => setSelectedDest(dest)}>
              <Image source={{ uri: dest.image }} style={styles.destImage} />
              <View style={styles.destOverlay}>
                <Text style={styles.destHotness}>{dest.hotness}</Text>
                <View>
                  <Text style={styles.destName}>{dest.name}</Text>
                  <Text style={styles.destMeta}>{dest.state} • ⭐ {dest.rating}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
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
  destCard: {
    height: 160,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  destImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  destOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'space-between',
    padding: 16,
  },
  destHotness: {
    alignSelf: 'flex-start',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    textTransform: 'uppercase',
  },
  destName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  destMeta: {
    color: '#cbd5e1',
    fontSize: 11,
    marginTop: 2,
  },
  backBtn: {
    marginBottom: 14,
    alignSelf: 'flex-start',
  },
  backBtnText: {
    color: '#3b82f6',
    fontSize: 13,
    fontWeight: 'bold',
  },
  detailImage: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  detailCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  detailTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  detailState: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  detailCategory: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  detailDesc: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  pkgBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  pkgBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  subTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 12,
  },
  spotItem: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.2)',
  },
  spotImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  spotInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  spotName: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  spotDesc: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 2,
  },
  hotelItem: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.2)',
  },
  hotelImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  hotelInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  hotelName: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  hotelLoc: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 2,
  },
  hotelRate: {
    color: '#2563eb',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
  hotelBookBtn: {
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    paddingVertical: 5,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 6,
  },
  hotelBookBtnText: {
    color: '#3b82f6',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
