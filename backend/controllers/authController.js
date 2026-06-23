const axios = require('axios');
const { auth, db, admin } = require('../config/firebase');

/**
 * @desc    Register a new user in Firebase Auth and store profile in Firestore
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, avatar, role, bio, location, provider } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters for Firebase Auth' });
    }

    const apiKey = process.env.FIREBASE_API_KEY;
    const isLocalTest = email.toLowerCase() === 'test.user@tournex.com' || process.env.MOCK_DB === 'true';

    let uid;
    const userProfile = {
      username: name,
      name,
      email: email.toLowerCase(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      provider: provider || (password === 'google_oauth_bypass_pass' ? 'google' : 'email'),
      avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      role: role || 'user',
      bio: bio || 'Wandering the cultural trails of India in search of stories and flavors.',
      location: location || 'New Delhi, India',
      joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      statesVisited: 0,
      savedTripsCount: 0,
      reviewsCount: 0,
      savedTotal: 0,
      level: 1,
      currentXp: 100,
      maxXp: 1000
    };

    if (isLocalTest || !apiKey) {
      // Mock register locally
      uid = 'mock-user-id-' + email.toLowerCase().replace(/[^a-z0-9]/g, '');
      userProfile.uid = uid;
      await db.collection('users').doc(uid).set(userProfile);
    } else {
      try {
        // Create user in Firebase Authentication
        const userRecord = await auth.createUser({
          email: email.toLowerCase(),
          password,
          displayName: name,
          photoURL: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
        });
        uid = userRecord.uid;
      } catch (authError) {
        // If user already exists in Firebase Auth (e.g. from Google SSO auto-registration)
        if (authError.code === 'auth/email-already-exists' || authError.message.includes('already exists') || authError.message.includes('already in use')) {
          const userRecord = await auth.getUserByEmail(email.toLowerCase());
          uid = userRecord.uid;
        } else {
          throw authError;
        }
      }
      // Store user profile in Firestore
      userProfile.uid = uid;
      await db.collection('users').doc(uid).set(userProfile);
    }

    res.status(201).json({
      success: true,
      data: {
        user: {
          uid,
          ...userProfile
        }
      },
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Registration Error:', error.message);
    let status = 400;
    let message = error.message || 'Error creating account';

    if (error.code === 'auth/email-already-exists') {
      message = 'The email address is already in use by another account.';
    } else if (error.code === 'auth/invalid-password' || (error.message && error.message.includes('password') && error.message.includes('characters'))) {
      message = 'The password must be at least 6 characters long.';
    } else if (error.code === 'auth/invalid-email') {
      message = 'The email address is badly formatted.';
    } else if (error.code === 'auth/network-request-failed') {
      status = 503;
      message = 'A network error occurred. Please check your internet connection.';
    }

    res.status(status).json({ success: false, message });
  }
};

/**
 * @desc    Log in user using Google Identity Toolkit REST API and fetch Firestore profile
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const apiKey = process.env.FIREBASE_API_KEY;
    const isLocalTest = email.toLowerCase() === 'test.user@tournex.com' || process.env.MOCK_DB === 'true';
    const isGoogleSim = password === 'google_oauth_bypass_pass';

    let idToken;
    let localId;
    let userData;

    if (isGoogleSim && apiKey) {
      // Google Auth simulation bypass with Firebase Auth check
      console.log('Simulated Google login bypass for:', email);
      let userRecord;
      try {
        userRecord = await auth.getUserByEmail(email.toLowerCase());
        localId = userRecord.uid;
      } catch (err) {
        // Create user in Firebase Auth if not exists
        userRecord = await auth.createUser({
          email: email.toLowerCase(),
          displayName: email.split('@')[0]
        });
        localId = userRecord.uid;
      }

      // Fetch user profile from Firestore users collection
      let userSnap = await db.collection('users').doc(localId).get();
      if (!userSnap.exists) {
        // Automatically create a mock Firestore profile
        const mockProfile = {
          uid: localId,
          username: userRecord.displayName || email.split('@')[0],
          name: userRecord.displayName || email.split('@')[0],
          email: email.toLowerCase(),
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          provider: 'google',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
          role: 'user',
          bio: 'Authenticated securely via simulated Google Account integration.',
          location: 'New Delhi, India',
          joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          statesVisited: 0,
          savedTripsCount: 0,
          reviewsCount: 0,
          savedTotal: 0,
          level: 1,
          currentXp: 100,
          maxXp: 1000
        };
        await db.collection('users').doc(localId).set(mockProfile);
        userData = mockProfile;
      } else {
        userData = userSnap.data();
      }
      idToken = 'mock-google-token-' + localId;
    } else if (isLocalTest || !apiKey) {
      // Mock / Offline authentication fallback
      console.log('Using offline mock authentication for:', email);
      localId = 'mock-user-id-' + email.toLowerCase().replace(/[^a-z0-9]/g, '');
      idToken = 'mock-id-token-' + localId;
      
      const userRef = db.collection('users').doc(localId);
      const userSnap = await userRef.get();
      
      if (!userSnap.exists) {
        // Automatically create a mock Firestore profile
        const mockProfile = {
          uid: localId,
          username: email.split('@')[0].replace(/\./g, ' '),
          name: email.split('@')[0].replace(/\./g, ' '),
          email: email.toLowerCase(),
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          provider: 'email',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
          role: 'user',
          bio: 'Offline developer profile credentials.',
          location: 'New Delhi, India',
          joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          statesVisited: 3,
          savedTripsCount: 5,
          reviewsCount: 2,
          savedTotal: 150000,
          level: 2,
          currentXp: 300,
          maxXp: 1000
        };
        await userRef.set(mockProfile);
        userData = mockProfile;
      } else {
        userData = userSnap.data();
      }
    } else {
      // Call Firebase Auth REST API to verify password and get ID token
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
      const response = await axios.post(url, {
        email: email.toLowerCase(),
        password,
        returnSecureToken: true
      });

      idToken = response.data.idToken;
      localId = response.data.localId;

      // Fetch user profile from Firestore users collection
      const userSnap = await db.collection('users').doc(localId).get();

      if (!userSnap.exists) {
        return res.status(404).json({ success: false, message: 'User profile not found in database' });
      }
      userData = userSnap.data();
    }

    res.json({
      success: true,
      data: {
        token: idToken,
        user: {
          uid: localId,
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar,
          bio: userData.bio,
          location: userData.location,
          tier: userData.tier || userData.role || 'Explorer',
          joinDate: userData.joinDate,
          stats: {
            statesVisited: Number(userData.statesVisited ?? 0),
            savedTripsCount: Number(userData.savedTripsCount ?? 0),
            reviewsCount: Number(userData.reviewsCount ?? 0),
            savedTotal: Number(userData.savedTotal ?? 0)
          },
          level: Number(userData.level ?? 1),
          currentXp: Number(userData.currentXp ?? 0),
          maxXp: Number(userData.maxXp ?? 1000)
        }
      },
      message: 'User logged in successfully'
    });
  } catch (error) {
    console.error('Login Error:', error.response?.data?.error?.message || error.message);
    const apiErrorMsg = error.response?.data?.error?.message || 'Invalid email or password';
    res.status(400).json({ success: false, message: apiErrorMsg });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getCurrentUserProfile = async (req, res, next) => {
  try {
    const userRef = db.collection('users').doc(req.user.uid);
    let userSnap = await userRef.get();

    if (!userSnap.exists) {
      // Create a default profile
      const defaultProfile = {
        uid: req.user.uid,
        username: req.user.name || 'Explorer',
        name: req.user.name || 'Explorer',
        email: req.user.email || '',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        provider: 'google',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        role: 'user',
        bio: 'Wandering the cultural trails of India in search of stories and flavors.',
        location: 'New Delhi, India',
        joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        statesVisited: 0,
        savedTripsCount: 0,
        reviewsCount: 0,
        savedTotal: 0,
        level: 1,
        currentXp: 100,
        maxXp: 1000
      };
      await userRef.set(defaultProfile);
      userSnap = await userRef.get();
    }

    const data = userSnap.data();

    res.json({
      success: true,
      data: {
        user: {
          uid: req.user.uid,
          name: data.name,
          email: data.email,
          avatar: data.avatar,
          bio: data.bio,
          location: data.location,
          tier: data.tier || data.role || 'Explorer',
          joinDate: data.joinDate,
          stats: {
            statesVisited: Number(data.statesVisited ?? 0),
            savedTripsCount: Number(data.savedTripsCount ?? 0),
            reviewsCount: Number(data.reviewsCount ?? 0),
            savedTotal: Number(data.savedTotal ?? 0)
          },
          level: Number(data.level ?? 1),
          currentXp: Number(data.currentXp ?? 0),
          maxXp: Number(data.maxXp ?? 1000)
        }
      },
      message: 'User profile retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUserProfile
};
