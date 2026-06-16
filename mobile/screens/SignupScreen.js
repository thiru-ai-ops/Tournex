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

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('New Delhi, India');
  const [bio, setBio] = useState('Wandering the cultural trails of India in search of stories and flavors.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Name, email, and password are required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.register({
        name: name.trim(),
        email: email.trim(),
        password,
        location: location.trim(),
        bio: bio.trim(),
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        role: 'user'
      });
      if (res.success) {
        // Auto login on success
        await api.login(email.trim(), password);
        navigation.replace('Home');
      }
    } catch (err) {
      setError(err.message || 'Error creating account.');
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
            <Text style={styles.logoText}>Tour<Text style={styles.logoAccent}>Nex</Text></Text>
            <Text style={styles.logoSubtext}>CREATE EXPLORER PROFILE</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Register Account</Text>
            <Text style={styles.subtitle}>Set up your traveler keys securely</Text>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>FULL NAME</Text>
              <TextInput 
                style={styles.input}
                placeholder="e.g. Satyajit Ray"
                placeholderTextColor="#94a3b8"
                value={name}
                onChangeText={(txt) => { setName(txt); setError(''); }}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
              <TextInput 
                style={styles.input}
                placeholder="explorer@tournex.com"
                placeholderTextColor="#94a3b8"
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
                placeholderTextColor="#94a3b8"
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
                placeholder="e.g. New Delhi, India"
                placeholderTextColor="#94a3b8"
                value={location}
                onChangeText={setLocation}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>SHORT BIO</Text>
              <TextInput 
                style={[styles.input, styles.textArea]}
                placeholder="Share your travel style..."
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={3}
                value={bio}
                onChangeText={setBio}
              />
            </View>

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
              onPress={() => navigation.navigate('Login')}
              disabled={loading}
            >
              <Text style={styles.switchButtonText}>
                Already have credentials? <Text style={styles.switchTextAccent}>Log In</Text>
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
    backgroundColor: '#0f172a',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  logoText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoAccent: {
    color: '#2563eb',
  },
  logoSubtext: {
    color: '#94a3b8',
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginTop: 2,
  },
  formContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  title: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
    marginBottom: 14,
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  errorText: {
    color: '#f87171',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 10,
  },
  inputLabel: {
    color: '#94a3b8',
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: '#334155',
  },
  textArea: {
    height: 55,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#334155',
  },
  dividerText: {
    color: '#64748b',
    paddingHorizontal: 10,
    fontSize: 9,
    fontWeight: 'bold',
  },
  googleButton: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingVertical: 10,
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
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2563eb',
    marginRight: 6,
  },
  googleButtonText: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: 'bold',
  },
  switchButton: {
    alignItems: 'center',
    marginTop: 14,
  },
  switchButtonText: {
    color: '#94a3b8',
    fontSize: 11,
  },
  switchTextAccent: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
});
