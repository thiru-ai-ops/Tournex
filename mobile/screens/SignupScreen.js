import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  SafeAreaView, 
  ScrollView,
  KeyboardAvoidingView, 
  Platform,
  Image,
  Alert
} from 'react-native';
import { api } from '../services/api';
import theme from '../theme';
import haptics from '../utils/haptics';

const AVATAR_PRESETS = [
  {
    id: 'av1',
    name: 'Mountain Trekker',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'av2',
    name: 'Backwater Explorer',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'av3',
    name: 'Heritage Chronicler',
    url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'av4',
    name: 'Spiritual Pilgrim',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150'
  }
];

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('New Delhi, India');
  const [bio, setBio] = useState('Wandering the cultural trails of India in search of stories and flavors.');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0].url);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = async () => {
    haptics.selection();
    if (!name.trim() || !email.trim() || !password.trim()) {
      haptics.error();
      setError('Name, email, and password are required.');
      return;
    }
    if (password.length < 6) {
      haptics.error();
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.register({
        name: name.trim(),
        email: email.trim(),
        password,
        location: location.trim(),
        bio: bio.trim(),
        avatar: selectedAvatar,
        role: 'user',
        provider: 'email'
      });
      if (res.success) {
        haptics.success();
        setSuccess('Account created successfully! Logging you in...');
        setTimeout(async () => {
          try {
            await api.login(email.trim(), password);
            navigation.replace('Home');
          } catch (loginErr) {
            haptics.error();
            setError(loginErr.message || 'Auto-login failed. Please try logging in manually.');
            setSuccess('');
            setLoading(false);
          }
        }, 1500);
      } else {
        setLoading(false);
      }
    } catch (err) {
      haptics.error();
      setError(err.message || 'Error creating account.');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    haptics.selection();
    Alert.alert(
      'Sign in with Google',
      'Select a sandbox Google account to authenticate:',
      [
        {
          text: 'Arjun Dev (arjun.travels@gmail.com)',
          onPress: () => performGoogleSignIn('arjun.travels@gmail.com', 'Arjun Dev')
        },
        {
          text: 'Priya Sharma (priya.sharma@gmail.com)',
          onPress: () => performGoogleSignIn('priya.sharma@gmail.com', 'Priya Sharma')
        },
        {
          text: 'Thiru Moorthy (thirumoorthy1706@gmail.com)',
          onPress: () => performGoogleSignIn('thirumoorthy1706@gmail.com', 'Thiru Moorthy')
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const performGoogleSignIn = async (email, name) => {
    setLoading(true);
    setError('');
    try {
      try {
        await api.register({
          name,
          email,
          password: 'google_oauth_bypass_pass',
          location: 'New Delhi, India',
          bio: 'Authenticated securely via simulated Google Account integration.',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
          role: 'user'
        });
      } catch (regErr) {
        console.log('Google auto-register status:', regErr.message);
      }

      const res = await api.login(email, 'google_oauth_bypass_pass');
      if (res.success && res.data?.user) {
        haptics.success();
        navigation.replace('Home');
      }
    } catch (err) {
      haptics.error();
      setError(err.message || 'Google Auth simulation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Logo Brand Header */}
          <View style={styles.logoContainer}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoIcon}>🏛️</Text>
            </View>
            <Text style={styles.logoText}>
              Tour<Text style={styles.logoAccent}>Nex</Text>
            </Text>
            <Text style={styles.logoSubtext}>CREATE TRAVELER KEYS</Text>
          </View>

          {/* Sign Up Form Content Card */}
          <View style={styles.formContainer}>
            <Text style={styles.title}>Register Account</Text>
            <Text style={styles.subtitle}>Set up your travel profile and start exploring</Text>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
              </View>
            ) : null}

            {success ? (
              <View style={styles.successContainer} id="signup-success-alert-mobile">
                <Text style={styles.successText}>🎉 {success}</Text>
              </View>
            ) : null}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}> traveler NAME</Text>
              <TextInput 
                style={styles.input}
                placeholder="e.g. Arjun Dev"
                placeholderTextColor={theme.colors.textLight}
                value={name}
                onChangeText={(txt) => { setName(txt); setError(''); }}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
              <TextInput 
                style={styles.input}
                placeholder="explorer@tournex.com"
                placeholderTextColor={theme.colors.textLight}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(txt) => { setEmail(txt); setError(''); }}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>PASSWORD (MIN 6 CHARS)</Text>
              <TextInput 
                style={styles.input}
                placeholder="Create passcode"
                placeholderTextColor={theme.colors.textLight}
                secureTextEntry
                autoCapitalize="none"
                value={password}
                onChangeText={(txt) => { setPassword(txt); setError(''); }}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CURRENT LOCATION</Text>
              <TextInput 
                style={styles.input}
                placeholder="e.g. Jaipur, Rajasthan"
                placeholderTextColor={theme.colors.textLight}
                value={location}
                onChangeText={setLocation}
              />
            </View>

            {/* Avatar Preset Selector */}
            <View style={styles.avatarSelectionContainer}>
              <Text style={styles.inputLabel}>CHOOSE TRAVELER AVATAR</Text>
              <View style={styles.avatarRow}>
                {AVATAR_PRESETS.map((av) => {
                  const isSelected = selectedAvatar === av.url;
                  return (
                    <TouchableOpacity 
                      key={av.id} 
                      style={[styles.avatarWrapper, isSelected ? styles.avatarWrapperActive : {}]}
                      onPress={() => { haptics.selection(); setSelectedAvatar(av.url); }}
                    >
                      <Image source={{ uri: av.url }} style={styles.avatarImg} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>SHORT BIO</Text>
              <TextInput 
                style={[styles.input, styles.textArea]}
                placeholder="Share your travel style..."
                placeholderTextColor={theme.colors.textLight}
                multiline
                numberOfLines={2}
                value={bio}
                onChangeText={setBio}
              />
            </View>

            {/* Signup button */}
            <TouchableOpacity 
              style={styles.button}
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>Register Explorer Profile</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR SECURE LOG IN</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google button */}
            <TouchableOpacity 
              style={styles.googleButton}
              onPress={handleGoogleSignIn}
              disabled={loading}
            >
              <Text style={styles.googleIconEmoji}>🌐</Text>
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            {/* Guest Bypass button */}
            <TouchableOpacity 
              style={styles.guestButton}
              onPress={() => {
                haptics.selection();
                setAuthToken('mock-guest-token');
                navigation.replace('Home');
              }}
              disabled={loading}
            >
              <Text style={styles.guestButtonText}>Explore as Guest (Offline Mode) →</Text>
            </TouchableOpacity>

            {/* Switch to login */}
            <TouchableOpacity 
              style={styles.switchButton}
              onPress={() => { haptics.selection(); navigation.navigate('Login'); }}
              disabled={loading}
            >
              <Text style={styles.switchButtonText}>
                Already have traveler credentials? <Text style={styles.switchTextAccent}>Log In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBadge: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  logoIcon: {
    fontSize: 28,
    color: '#ffffff',
  },
  logoText: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoAccent: {
    color: theme.colors.primary,
  },
  logoSubtext: {
    color: theme.colors.textLight,
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginTop: 2,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: theme.radius.card,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
  },
  title: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 11,
    marginTop: 2,
    marginBottom: 14,
  },
  errorContainer: {
    backgroundColor: theme.colors.errorBg,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  successContainer: {
    backgroundColor: theme.colors.successBg,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.2)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  successText: {
    color: theme.colors.success,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 10,
  },
  inputLabel: {
    color: theme.colors.textLight,
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: theme.radius.input,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  textArea: {
    height: 50,
    textAlignVertical: 'top',
  },
  avatarSelectionContainer: {
    marginBottom: 12,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  avatarWrapper: {
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 24,
    padding: 2,
  },
  avatarWrapperActive: {
    borderColor: theme.colors.primary,
  },
  avatarImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.button,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    color: theme.colors.textLight,
    paddingHorizontal: 10,
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  googleButton: {
    backgroundColor: '#ffffff',
    borderRadius: theme.radius.button,
    paddingVertical: 11,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
  },
  googleIconEmoji: {
    fontSize: 13,
    marginRight: 6,
  },
  googleButtonText: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
  guestButton: {
    backgroundColor: 'transparent',
    borderRadius: theme.radius.button,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
    marginTop: 10,
  },
  guestButtonText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  switchButton: {
    alignItems: 'center',
    marginTop: 14,
  },
  switchButtonText: {
    color: theme.colors.textMuted,
    fontSize: 11,
  },
  switchTextAccent: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});
