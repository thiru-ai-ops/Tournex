import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  TextInput,
  Alert,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { api } from '../services/api';

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Edit fields
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editLocation, setEditLocation] = useState('');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profRes = await api.getProfile();
      if (profRes.success && profRes.data?.user) {
        const u = profRes.data.user;
        setProfile(u);
        setEditName(u.name || '');
        setEditBio(u.bio || '');
        setEditLocation(u.location || '');
      }
    } catch (e) {
      console.warn('Error fetching profile:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

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

  const handleLogout = () => {
    api.logout();
    // Tab navigator screen needs to replace root stack route to Login screen
    navigation.replace('Login');
  };

  if (loading && !profile) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#2563eb" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {/* User Stats Card */}
        <View style={styles.profileCard}>
          <Image source={{ uri: profile?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150' }} style={styles.profileAvatar} />
          <View style={[styles.statusBadge, api.isOfflineMode() ? styles.statusBadgeOffline : styles.statusBadgeOnline]}>
            <Text style={[styles.statusBadgeText, api.isOfflineMode() ? styles.statusBadgeTextOffline : styles.statusBadgeTextOnline]}>
              {api.isOfflineMode() ? '● Offline Sandbox Mode' : '● Live Sync Active'}
            </Text>
          </View>
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

        {/* Session Log out option */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>Logout Travel Session</Text>
        </TouchableOpacity>
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
  fieldLabel: {
    color: '#94a3b8',
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
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
  formTextArea: {
    height: 60,
    textAlignVertical: 'top',
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
  logoutBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  logoutBtnText: {
    color: '#f87171',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 4,
  },
  statusBadgeOnline: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  statusBadgeOffline: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusBadgeTextOnline: {
    color: '#10b981',
  },
  statusBadgeTextOffline: {
    color: '#f59e0b',
  },
});
