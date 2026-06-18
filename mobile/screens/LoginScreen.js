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
import { api } from '../services/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.login(email.trim(), password);
      if (res.success && res.data?.user) {
        navigation.replace('Home');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
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
      // First, attempt to auto-register this simulated google profile in the backend
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
        // Skips if user document is already set up, which is expected for returning users
        console.log('Google auto-register status:', regErr.message);
      }

      // Log in using the registered simulated keys
      const res = await api.login(email, 'google_oauth_bypass_pass');
      if (res.success && res.data?.user) {
        navigation.replace('Home');
      }
    } catch (err) {
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
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoIconText}>T</Text>
            </View>
            <Text style={styles.logoText}>Tour<Text style={styles.logoAccent}>Nex</Text></Text>
            <Text style={styles.logoSubtext}>AI TRAVEL COMPANION</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Log in to access your travel dashboard</Text>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
              <TextInput 
                style={styles.input}
                testID="emailInput"
                accessibilityLabel="emailInput"
                placeholder="explorer@tournex.com"
                placeholderTextColor="#94a3b8"
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
                placeholderTextColor="#94a3b8"
                secureTextEntry
                autoCapitalize="none"
                value={password}
                onChangeText={(txt) => { setPassword(txt); setError(''); }}
              />
            </View>

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
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Button */}
            <TouchableOpacity 
              style={styles.googleButton}
              onPress={handleGoogleSignIn}
              disabled={loading}
            >
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.switchButton}
              onPress={() => navigation.navigate('Signup')}
              disabled={loading}
            >
              <Text style={styles.switchButtonText}>
                Don't have keys yet? <Text style={styles.switchTextAccent}>Create Account</Text>
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
    backgroundColor: '#0f172a', // deep dark slate
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingVertical: 30,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: '#2563eb', // royal blue
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  logoIconText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '900',
  },
  logoText: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  logoAccent: {
    color: '#2563eb',
  },
  logoSubtext: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginTop: 4,
  },
  formContainer: {
    backgroundColor: '#1e293b', // slate-800
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155', // slate-700
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 20,
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#f87171',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: '#334155',
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#2563eb',
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
    backgroundColor: '#334155',
  },
  dividerText: {
    color: '#64748b',
    paddingHorizontal: 12,
    fontSize: 10,
    fontWeight: 'bold',
  },
  googleButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  googleIcon: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563eb',
    marginRight: 8,
  },
  googleButtonText: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: 'bold',
  },
  switchButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  switchButtonText: {
    color: '#94a3b8',
    fontSize: 12,
  },
  switchTextAccent: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
});
