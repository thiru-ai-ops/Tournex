import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  SafeAreaView, 
  Image, 
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { api } from '../services/api';
import { ALL_DESTINATIONS } from '../data';

export default function HomeScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);
  
  const [activeTab, setActiveTab] = useState('explore'); // explore, companion, splitter, bookings, profile
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Explore Tab State
  const [selectedDest, setSelectedDest] = useState(null);

  // Companion Chat State
  const [chatInput, setChatInput] = useState('');
  const chatScrollRef = useRef(null);

  // Splitter State
  const [expDesc, setExpDesc] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState('Food');
  const [expPaidBy, setExpPaidBy] = useState('Arjun');

  // Profile Edit State
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch user profile
      const profRes = await api.getProfile();
      if (profRes.success) {
        setProfile(profRes.data.user);
        setEditName(profRes.data.user.name || '');
        setEditBio(profRes.data.user.bio || '');
        setEditLocation(profRes.data.user.location || '');
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

      // Fetch messages
      try {
        const msgRes = await api.getMessages();
        if (msgRes.success) {
          setMessages(msgRes.data.messages || []);
        }
      } catch (e) {
        console.warn('Error fetching messages:', e.message);
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

  // --- Explore Functions ---
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
      const bookRes = await api.getBookings();
      if (bookRes.success) {
        setBookings(bookRes.data.bookings || []);
      }
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
      const bookRes = await api.getBookings();
      if (bookRes.success) {
        setBookings(bookRes.data.bookings || []);
      }
      Alert.alert('Package Registered', `Successfully booked ${destination.name} Package. Booking ID: ${randomId}`);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Companion Chat Functions ---
  const handleSendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const text = chatInput.trim();
    setChatInput('');

    const userMsg = {
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    try {
      await api.addMessage(userMsg);
      const res = await api.getMessages();
      setMessages(res.data.messages || []);

      setTimeout(async () => {
        let aiText = '';
        const lower = text.toLowerCase();

        if (lower.includes('hawa mahal') || lower.includes('crowd')) {
          aiText = "Based on our live tourist density index, Hawa Mahal gets highly congested after 11:30 AM. Sunrise is the absolute prime hour!\n\nPro-Tip: Enter via the rear street entrance rather than the main heavy marketplace arch for a shorter queue line of under 5 minutes.";
        } else if (lower.includes('jaipur') || lower.includes('palace') || lower.includes('fort')) {
          aiText = "Jaipur is stunning! I suggest visiting Amer Fort (glorious elephant walks and mirror work), and the ornate City Palace.\n\nLocal secrets tell that you should try Lassi at Lassiwala on M.I. Road—they serve it inside clay hand-baked kulladh cups since 1944. It is an amazing cultural treat!";
        } else if (lower.includes('varanasi') || lower.includes('aarti') || lower.includes('ghat')) {
          aiText = "Varanasi Ghats are deeply mystical. I suggest witnessing the evening Ganga Aarti at Dashashwamedh Ghat starting at 6:30 PM. Rent a rowboat for the best views!";
        } else if (lower.includes('guide')) {
          aiText = "We found 2 government-accredited local guides available tomorrow morning. They speak fluent English/Hindi and charge standard regulated rates of ₹800/hour. Let me know if you would like me to book one!";
        } else {
          aiText = `Sure! I am monitoring standard travel metrics for your current query. Let me know if you would like custom guide lists, weather charts, or local food reviews!`;
        }

        const aiMsg = {
          sender: 'ai',
          text: aiText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        await api.addMessage(aiMsg);
        const resUpdated = await api.getMessages();
        setMessages(resUpdated.data.messages || []);
      }, 1200);

    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleClearChatHistory = async () => {
    try {
      setLoading(true);
      await api.clearMessages();
      setMessages([]);
      Alert.alert('Chat Cleared', 'Simulated companion chat log has been cleared.');
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Splitter Functions ---
  const handleAddExpense = async () => {
    if (!expDesc.trim() || !expAmount.trim()) {
      Alert.alert('Validation Alert', 'Please enter a description and amount.');
      return;
    }
    const amountNum = parseFloat(expAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Validation Alert', 'Please enter a valid positive number for amount.');
      return;
    }

    const newExpense = {
      id: `expense-${Date.now()}`,
      description: expDesc.trim(),
      amount: amountNum,
      category: expCategory,
      paidBy: expPaidBy,
      splitWith: ['Arjun', 'Priya', 'Sanya', 'Rahul'],
      date: new Date().toISOString().split('T')[0]
    };

    try {
      setLoading(true);
      await api.addExpense(newExpense);
      const expRes = await api.getExpenses();
      if (expRes.success) {
        setExpenses(expRes.data.expenses || []);
      }
      setExpDesc('');
      setExpAmount('');
      Alert.alert('Expense Added', `Split recorded: "${newExpense.description}" for ₹${newExpense.amount}`);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      setLoading(true);
      await api.deleteExpense(id);
      const expRes = await api.getExpenses();
      if (expRes.success) {
        setExpenses(expRes.data.expenses || []);
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearExpenses = async () => {
    try {
      setLoading(true);
      await api.clearExpenses();
      setExpenses([]);
      Alert.alert('Expenses Cleared', 'All split-bill records have been wiped.');
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Profile Edit Functions ---
  const handleUpdateProfile = async () => {
    if (!editName.trim()) {
      Alert.alert('Validation Error', 'Name cannot be blank.');
      return;
    }
    setUpdatingProfile(true);
    try {
      const res = await api.updateProfile({
        name: editName.trim(),
        bio: editBio.trim(),
        location: editLocation.trim(),
        avatar: profile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        role: profile.role || 'user'
      });
      if (res.success && res.data?.user) {
        setProfile(res.data.user);
        Alert.alert('Profile Saved', 'Explorer credentials updated successfully!');
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setUpdatingProfile(false);
    }
  };

  if (loading && !profile) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Syncing TourNex travel platform...</Text>
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
      {/* Top Header Panel */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={{ uri: profile?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150' }} 
            style={styles.avatarMini} 
          />
          <View>
            <Text style={styles.appName}>Tour<Text style={styles.appAccent}>Nex</Text></Text>
            <Text style={styles.userTier}>{profile?.tier || 'Explorer'}</Text>
          </View>
        </View>
        <TouchableOpacity testID="logoutButton" accessibilityLabel="logoutButton" style={styles.headerLogout} onPress={handleLogout}>
          <Text style={styles.headerLogoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Router */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.body}
      >
        {activeTab === 'explore' && (
          selectedDest ? (
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
          )
        )}

        {activeTab === 'companion' && (
          <View style={styles.chatContainer}>
            <ScrollView 
              ref={chatScrollRef}
              contentContainerStyle={styles.chatScroll} 
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => chatScrollRef.current?.scrollToEnd({ animated: true })}
            >
              {messages.length === 0 ? (
                <View style={styles.chatEmpty}>
                  <Text style={styles.chatEmptyIcon}>💬</Text>
                  <Text style={styles.chatEmptyTitle}>Conversational Intellect</Text>
                  <Text style={styles.chatEmptyDesc}>
                    Ask me about crowd timing at Hawa Mahal, local regulatory guidelines, or book local guides directly.
                  </Text>
                </View>
              ) : (
                messages.map((msg, i) => (
                  <View 
                    key={msg.id || i} 
                    style={[
                      styles.chatMsgBox, 
                      msg.sender === 'user' ? styles.chatMsgUser : styles.chatMsgAI
                    ]}
                  >
                    <Text style={styles.chatMsgText}>{msg.text}</Text>
                    <Text style={styles.chatMsgTime}>{msg.time}</Text>
                  </View>
                ))
              )}
            </ScrollView>

            <View style={styles.chatInputRow}>
              <TextInput 
                style={styles.chatInputField}
                placeholder="Ask travel companion..."
                placeholderTextColor="#64748b"
                value={chatInput}
                onChangeText={setChatInput}
                onSubmitEditing={handleSendChatMessage}
              />
              <TouchableOpacity style={styles.chatSendBtn} onPress={handleSendChatMessage}>
                <Text style={styles.chatSendBtnText}>Send</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.chatClearBtn} onPress={handleClearChatHistory}>
                <Text style={styles.chatClearBtnText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === 'splitter' && (
          <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
            <View style={styles.budgetOverview}>
              <Text style={styles.budgetTitle}>Group Travel Ledger</Text>
              <Text style={styles.budgetAmount}>₹{totalExpenses.toLocaleString()}</Text>
              <Text style={styles.budgetDesc}>Splitting equally with Arjun, Priya, Sanya, and Rahul</Text>
              {expenses.length > 0 && (
                <TouchableOpacity style={styles.clearLedgerBtn} onPress={handleClearExpenses}>
                  <Text style={styles.clearLedgerBtnText}>Wipe Split Ledger</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Split Form */}
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Record Transaction</Text>
              
              <TextInput 
                style={styles.formInput}
                placeholder="Expense Description (e.g. Dinner at Lassiwala)"
                placeholderTextColor="#64748b"
                value={expDesc}
                onChangeText={setExpDesc}
              />

              <TextInput 
                style={styles.formInput}
                placeholder="Amount (₹)"
                placeholderTextColor="#64748b"
                keyboardType="numeric"
                value={expAmount}
                onChangeText={expAmount => setExpAmount(expAmount.replace(/[^0-9.]/g, ''))}
              />

              <View style={styles.selectRow}>
                <Text style={styles.selectLabel}>Category:</Text>
                {['Food', 'Stay', 'Transit', 'Activity'].map((cat) => (
                  <TouchableOpacity 
                    key={cat} 
                    style={[styles.selectBtn, expCategory === cat ? styles.selectBtnActive : {}]}
                    onPress={() => setExpCategory(cat)}
                  >
                    <Text style={[styles.selectBtnText, expCategory === cat ? styles.selectBtnTextActive : {}]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.selectRow}>
                <Text style={styles.selectLabel}>Paid By:</Text>
                {['Arjun', 'Priya', 'Rahul'].map((payee) => (
                  <TouchableOpacity 
                    key={payee} 
                    style={[styles.selectBtn, expPaidBy === payee ? styles.selectBtnActive : {}]}
                    onPress={() => setExpPaidBy(payee)}
                  >
                    <Text style={[styles.selectBtnText, expPaidBy === payee ? styles.selectBtnTextActive : {}]}>{payee}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.submitBtn} onPress={handleAddExpense}>
                <Text style={styles.submitBtnText}>Add to Split Bill</Text>
              </TouchableOpacity>
            </View>

            {/* Expenses List */}
            <Text style={styles.subTitle}>Transaction History</Text>
            {expenses.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>💸 No transaction logs recorded yet</Text>
              </View>
            ) : (
              expenses.map((expense) => (
                <View key={expense.id} style={styles.expenseCard}>
                  <View style={styles.expenseLeft}>
                    <Text style={styles.expenseName}>{expense.description}</Text>
                    <Text style={styles.expenseMeta}>{expense.category} • Paid by {expense.paidBy} on {expense.date}</Text>
                  </View>
                  <View style={styles.expenseRight}>
                    <Text style={styles.expenseVal}>₹{expense.amount.toLocaleString()}</Text>
                    <TouchableOpacity style={styles.delExpenseBtn} onPress={() => handleDeleteExpense(expense.id)}>
                      <Text style={styles.delExpenseText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}

        {activeTab === 'bookings' && (
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
        )}

        {activeTab === 'profile' && (
          <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* User Stats Card */}
            <View style={styles.profileCard}>
              <Image source={{ uri: profile?.avatar }} style={styles.profileAvatar} />
              <Text style={styles.profileName}>{profile?.name}</Text>
              <Text style={styles.profileMeta}>{profile?.location} • Lvl {profile?.level || 1}</Text>
              <Text style={styles.profileBio}>{profile?.bio}</Text>

              <View style={styles.profileStatsRow}>
                <View style={styles.pStatBox}>
                  <Text style={styles.pStatNum}>{profile?.stats?.statesVisited || 0}</Text>
                  <Text style={styles.pStatLabel}>States</Text>
                </View>
                <View style={styles.pStatBox}>
                  <Text style={styles.pStatNum}>{profile?.stats?.savedTripsCount || 0}</Text>
                  <Text style={styles.pStatLabel}>Trips</Text>
                </View>
                <View style={styles.pStatBox}>
                  <Text style={styles.pStatNum}>{profile?.stats?.reviewsCount || 0}</Text>
                  <Text style={styles.pStatLabel}>Reviews</Text>
                </View>
              </View>
            </View>

            {/* Edit Credentials Form */}
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Edit Traveler Credentials</Text>
              
              <Text style={styles.fieldLabel}>FULL NAME</Text>
              <TextInput 
                style={styles.formInput}
                value={editName}
                onChangeText={setEditName}
                placeholder="Your Name"
                placeholderTextColor="#64748b"
              />

              <Text style={styles.fieldLabel}>LOCATION</Text>
              <TextInput 
                style={styles.formInput}
                value={editLocation}
                onChangeText={setEditLocation}
                placeholder="e.g. New Delhi, India"
                placeholderTextColor="#64748b"
              />

              <Text style={styles.fieldLabel}>SHORT BIO</Text>
              <TextInput 
                style={[styles.formInput, styles.formTextArea]}
                value={editBio}
                onChangeText={setEditBio}
                placeholder="Share your travel experiences..."
                placeholderTextColor="#64748b"
                multiline
                numberOfLines={3}
              />

              <TouchableOpacity 
                style={styles.submitBtn} 
                onPress={handleUpdateProfile}
                disabled={updatingProfile}
              >
                {updatingProfile ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.submitBtnText}>Update Explorer Profile</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </KeyboardAvoidingView>

      {/* Bottom Pinned Navigation Bar */}
      <View style={styles.navBar}>
        {[
          { id: 'explore', label: 'Explore', icon: '🧭' },
          { id: 'companion', label: 'Chat', icon: '💬' },
          { id: 'splitter', label: 'Splitter', icon: '💸' },
          { id: 'bookings', label: 'Bookings', icon: '🎫' },
          { id: 'profile', label: 'Profile', icon: '👤' }
        ].map((tab) => (
          <TouchableOpacity 
            key={tab.id} 
            style={[styles.navBtn, activeTab === tab.id ? styles.navBtnActive : {}]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={styles.navIcon}>{tab.icon}</Text>
            <Text style={[styles.navText, activeTab === tab.id ? styles.navTextActive : {}]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#1e293b',
    backgroundColor: '#0f172a',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarMini: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: '#2563eb',
  },
  appName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  appAccent: {
    color: '#2563eb',
  },
  userTier: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '600',
  },
  headerLogout: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ef444450',
  },
  headerLogoutText: {
    color: '#ef4444',
    fontSize: 10,
    fontWeight: 'bold',
  },
  body: {
    flex: 1,
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
  chatContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  chatScroll: {
    padding: 16,
    paddingBottom: 24,
  },
  chatEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    paddingHorizontal: 30,
  },
  chatEmptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  chatEmptyTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  chatEmptyDesc: {
    color: '#64748b',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  chatMsgBox: {
    maxWidth: '80%',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
  },
  chatMsgUser: {
    backgroundColor: '#2563eb',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 2,
  },
  chatMsgAI: {
    backgroundColor: '#1e293b',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: '#334155',
  },
  chatMsgText: {
    color: '#ffffff',
    fontSize: 13,
    lineHeight: 18,
  },
  chatMsgTime: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 9,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#1e293b',
    backgroundColor: '#0f172a',
  },
  chatInputField: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    color: '#ffffff',
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#334155',
    marginRight: 8,
  },
  chatSendBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  chatSendBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatClearBtn: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  chatClearBtnText: {
    fontSize: 12,
  },
  budgetOverview: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    marginBottom: 16,
  },
  budgetTitle: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: 'bold',
  },
  budgetAmount: {
    color: '#10b981',
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  budgetDesc: {
    color: '#64748b',
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 12,
  },
  clearLedgerBtn: {
    borderColor: '#ef444480',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  clearLedgerBtnText: {
    color: '#ef4444',
    fontSize: 10,
    fontWeight: 'bold',
  },
  formCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  formTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  formInput: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#ffffff',
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 10,
  },
  selectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
    gap: 6,
  },
  selectLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: 'bold',
    marginRight: 6,
  },
  selectBtn: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  selectBtnActive: {
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    borderColor: '#2563eb',
  },
  selectBtnText: {
    color: '#64748b',
    fontSize: 10,
  },
  selectBtnTextActive: {
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  submitBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
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
  expenseCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  expenseLeft: {
    flex: 1,
    marginRight: 10,
  },
  expenseName: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  expenseMeta: {
    color: '#64748b',
    fontSize: 9,
    marginTop: 2,
  },
  expenseRight: {
    alignItems: 'flex-end',
  },
  expenseVal: {
    color: '#10b981',
    fontSize: 13,
    fontWeight: 'bold',
  },
  delExpenseBtn: {
    marginTop: 4,
  },
  delExpenseText: {
    color: '#ef4444',
    fontSize: 9,
    fontWeight: 'bold',
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
  profileCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#2563eb',
    marginBottom: 10,
  },
  profileName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileMeta: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 2,
  },
  profileBio: {
    color: '#cbd5e1',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  profileStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 12,
    width: '100%',
  },
  pStatBox: {
    alignItems: 'center',
    flex: 1,
  },
  pStatNum: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pStatLabel: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
  },
  fieldLabel: {
    color: '#94a3b8',
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  formTextArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderColor: '#334155',
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
  },
  navBtn: {
    alignItems: 'center',
    flex: 1,
  },
  navBtnActive: {
    // optional background scaling or selection highlight
  },
  navIcon: {
    fontSize: 20,
  },
  navText: {
    color: '#64748b',
    fontSize: 9,
    marginTop: 3,
    fontWeight: '600',
  },
  navTextActive: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
});
