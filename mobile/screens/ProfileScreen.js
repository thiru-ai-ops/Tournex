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
  RefreshControl,
  SafeAreaView
} from 'react-native';
import { api } from '../services/api';
import theme from '../theme';
import haptics from '../utils/haptics';

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Edit fields
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editLocation, setEditLocation] = useState('');

  const fetchProfile = async () => {
    try {
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
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchProfile();
  }, []);

  const onRefresh = () => {
    haptics.selection();
    setRefreshing(true);
    fetchProfile();
  };

  const handleUpdateProfile = async () => {
    haptics.selection();
    if (!editName.trim()) {
      haptics.error();
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
        haptics.success();
        setProfile(res.data.user);
        Alert.alert('Profile Saved', 'Explorer credentials updated successfully!');
      }
    } catch (err) {
      haptics.error();
      Alert.alert('Error', err.message);
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleLogout = () => {
    haptics.selection();
    api.logout();
    haptics.success();
    navigation.replace('Login');
  };

  if (loading && !profile) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Panel */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Explorer Profile</Text>
        <Text style={styles.pageSubtitle}>Manage your traveler account settings</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollBody} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
        }
      >
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
            <View style={styles.dividerCol} />
            <View style={styles.pStatBox}>
              <Text style={styles.pStatNum}>{profile?.stats?.savedTripsCount || 0}</Text>
              <Text style={styles.pStatLabel}>Trips</Text>
            </View>
            <View style={styles.dividerCol} />
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
            placeholderTextColor={theme.colors.textLight}
          />

          <Text style={styles.fieldLabel}>LOCATION</Text>
          <TextInput 
            style={styles.formInput}
            value={editLocation}
            onChangeText={setEditLocation}
            placeholder="e.g. Jaipur, Rajasthan"
            placeholderTextColor={theme.colors.textLight}
          />

          <Text style={styles.fieldLabel}>SHORT BIO</Text>
          <TextInput 
            style={[styles.formInput, styles.formTextArea]}
            value={editBio}
            onChangeText={setEditBio}
            placeholder="Share your travel experiences..."
            placeholderTextColor={theme.colors.textLight}
            multiline
            numberOfLines={2}
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
    backgroundColor: theme.colors.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
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
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: theme.radius.card,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    marginBottom: 16,
    ...theme.shadows.small,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: theme.colors.primaryLight,
    marginBottom: 10,
  },
  profileName: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  profileMeta: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  profileBio: {
    color: theme.colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  profileStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.primaryLightest,
    borderRadius: theme.radius.card - 4,
    padding: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: theme.colors.primaryLight,
  },
  pStatBox: {
    alignItems: 'center',
    flex: 1,
  },
  pStatNum: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  pStatLabel: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  dividerCol: {
    width: 1,
    height: 24,
    backgroundColor: theme.colors.primaryLight,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: theme.radius.card,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 16,
    ...theme.shadows.small,
  },
  formTitle: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  fieldLabel: {
    color: theme.colors.textLight,
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  formInput: {
    backgroundColor: '#ffffff',
    borderRadius: theme.radius.input,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: theme.colors.text,
    fontSize: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 10,
  },
  formTextArea: {
    height: 55,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.button,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  logoutBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: theme.radius.button,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.15)',
  },
  logoutBtnText: {
    color: theme.colors.error,
    fontSize: 13,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
    marginTop: 4,
  },
  statusBadgeOnline: {
    backgroundColor: theme.colors.successBg,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  statusBadgeOffline: {
    backgroundColor: theme.colors.warningBg,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusBadgeTextOnline: {
    color: theme.colors.success,
  },
  statusBadgeTextOffline: {
    color: theme.colors.warning,
  },
});
