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
  Alert
} from 'react-native';
import { api, setAuthToken } from '../services/api';
import theme from '../theme';
import haptics from '../utils/haptics';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    haptics.selection();
    if (!email.trim() || !password.trim()) {
      haptics.error();
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.login(email.trim(), password);
      if (res.success && res.data?.user) {
        haptics.success();
        navigation.replace('Home');
      }
    } catch (err) {
      haptics.error();
      setError(err.message || 'Invalid email or password.');
    } finally {
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
            <Text style={styles.logoSubtext}>AI TRAVEL ENGINE</Text>
          </View>

          {/* Form Content Card */}
          <View style={styles.formCard}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Enter credentials to access your travel profile</Text>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
              </View>
            ) : null}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
              <TextInput 
                style={styles.input}
                testID="emailInput"
                accessibilityLabel="emailInput"
                placeholder="explorer@tournex.com"
                placeholderTextColor={theme.colors.textLight}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(txt) => { setEmail(txt); setError(''); }}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>PASSWORD</Text>
              <TextInput 
                style={styles.input}
                testID="passwordInput"
                accessibilityLabel="passwordInput"
                placeholder="Enter passcode"
                placeholderTextColor={theme.colors.textLight}
                secureTextEntry
                autoCapitalize="none"
                value={password}
                onChangeText={(txt) => { setPassword(txt); setError(''); }}
              />
            </View>

            {/* Login button */}
            <TouchableOpacity 
              style={styles.button}
              testID="loginButton"
              accessibilityLabel="loginButton"
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>Authenticate & Enter</Text>
              )}
            </TouchableOpacity>

            {/* SSO Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR SECURE LOG IN</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Button */}
            <TouchableOpacity 
              style={styles.googleButton}
              onPress={handleGoogleSignIn}
              disabled={loading}
            >
              <Text style={styles.googleIconEmoji}>🌐</Text>
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            {/* Guest Bypass Button */}
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

            {/* Switch to Signup */}
            <TouchableOpacity 
              style={styles.switchButton}
              onPress={() => { haptics.selection(); navigation.navigate('Signup'); }}
              disabled={loading}
            >
              <Text style={styles.switchButtonText}>
                New traveler? <Text style={styles.switchTextAccent}>Create Account</Text>
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
    paddingVertical: 40,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  logoIcon: {
    fontSize: 32,
    color: '#ffffff',
  },
  logoText: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: 'bold',
  },
  logoAccent: {
    color: theme.colors.primary,
  },
  logoSubtext: {
    color: theme.colors.textLight,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginTop: 4,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: theme.radius.card,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
  },
  title: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 20,
  },
  errorContainer: {
    backgroundColor: theme.colors.errorBg,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: theme.colors.textLight,
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: theme.radius.input,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.button,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    color: theme.colors.textLight,
    paddingHorizontal: 12,
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  googleButton: {
    backgroundColor: '#ffffff',
    borderRadius: theme.radius.button,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
  },
  googleIconEmoji: {
    fontSize: 14,
    marginRight: 8,
  },
  googleButtonText: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: 'bold',
  },
  guestButton: {
    backgroundColor: 'transparent',
    borderRadius: theme.radius.button,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
    marginTop: 12,
  },
  guestButtonText: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: 'bold',
  },
  switchButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  switchButtonText: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  switchTextAccent: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});
