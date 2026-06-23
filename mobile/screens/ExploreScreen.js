import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Alert,
  TextInput,
  RefreshControl,
  SafeAreaView
} from 'react-native';
import { api } from '../services/api';
import { ALL_DESTINATIONS } from '../data';
import theme from '../theme';
import haptics from '../utils/haptics';
import SkeletonLoader from '../components/SkeletonLoader';

export default function ExploreScreen() {
  const [selectedDest, setSelectedDest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleBookHotel = async (hotel) => {
    haptics.selection();
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
      haptics.success();
      Alert.alert('Reservation Locked', `Successfully booked ${hotel.name}. Booking ID: ${randomId}`);
    } catch (err) {
      haptics.error();
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookPackage = async (destination) => {
    haptics.selection();
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
      haptics.success();
      Alert.alert('Package Registered', `Successfully booked ${destination.name} Package. Booking ID: ${randomId}`);
    } catch (err) {
      haptics.error();
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    haptics.selection();
    setRefreshing(true);
    // Simulate refresh reload
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Filter destinations by search query
  const filteredDestinations = ALL_DESTINATIONS.filter(dest => {
    const q = searchQuery.toLowerCase();
    return (
      dest.name.toLowerCase().includes(q) ||
      dest.state.toLowerCase().includes(q) ||
      dest.category.toLowerCase().includes(q)
    );
  });

  if (loading) {
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
      {selectedDest ? (
        <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => { haptics.selection(); setSelectedDest(null); }}
          >
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
        <View style={{ flex: 1 }}>
          {/* Header & Search */}
          <View style={styles.searchHeader}>
            <Text style={styles.mainTitle}>Explore India</Text>
            <Text style={styles.mainSub}>ASI heritage sites and partner stays</Text>
            
            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput 
                style={styles.searchInput}
                placeholder="Search name, category, or state..."
                placeholderTextColor={theme.colors.textLight}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Text style={styles.clearSearchIcon}>❌</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          <ScrollView 
            contentContainerStyle={styles.scrollBody} 
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
            }
          >
            {filteredDestinations.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>🔍 No destinations match your query</Text>
              </View>
            ) : (
              filteredDestinations.map((dest) => (
                <TouchableOpacity 
                  key={dest.id} 
                  style={styles.destCard} 
                  onPress={() => { haptics.selection(); setSelectedDest(dest); }}
                >
                  <Image source={{ uri: dest.image }} style={styles.destImage} />
                  <View style={styles.destOverlay}>
                    <Text style={styles.destHotness}>{dest.hotness}</Text>
                    <View>
                      <Text style={styles.destName}>{dest.name}</Text>
                      <Text style={styles.destMeta}>{dest.state} • ⭐ {dest.rating}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollBody: {
    padding: 16,
    paddingBottom: 40,
  },
  searchHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  mainTitle: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: 'bold',
  },
  mainSub: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: 2,
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.input,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    height: 42,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '500',
  },
  clearSearchIcon: {
    fontSize: 12,
    marginLeft: 6,
  },
  destCard: {
    height: 160,
    borderRadius: theme.radius.card,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
  },
  destImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  destOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'space-between',
    padding: 16,
  },
  destHotness: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary,
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
    color: '#e2e8f0',
    fontSize: 11,
    marginTop: 2,
  },
  backBtn: {
    marginBottom: 14,
    alignSelf: 'flex-start',
  },
  backBtnText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailImage: {
    width: '100%',
    height: 180,
    borderRadius: theme.radius.card,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  detailCard: {
    backgroundColor: '#ffffff',
    borderRadius: theme.radius.card,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
  },
  detailTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  detailState: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  detailCategory: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  detailDesc: {
    color: theme.colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  pkgBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.button,
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
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 12,
  },
  spotItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
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
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
  spotDesc: {
    color: theme.colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  hotelItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
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
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
  hotelLoc: {
    color: theme.colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  hotelRate: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
  hotelBookBtn: {
    backgroundColor: theme.colors.primaryLightest,
    borderWidth: 1,
    borderColor: theme.colors.primaryLight,
    paddingVertical: 5,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 6,
  },
  hotelBookBtnText: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: theme.radius.card,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    marginTop: 10,
  },
  emptyText: {
    color: theme.colors.textLight,
    fontSize: 12,
    fontWeight: '600',
  },
});
