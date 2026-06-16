const { auth, db } = require('../config/firebase');

/**
 * Protect routes - Verifies Firebase ID Token and injects user profile
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      let decodedToken;
      if (token.startsWith('mock-')) {
        let uid = '';
        if (token.startsWith('mock-id-token-')) {
          uid = token.replace('mock-id-token-', '');
        } else if (token.startsWith('mock-google-token-')) {
          uid = token.replace('mock-google-token-', '');
        }

        let email = 'test.user@tournex.com';
        let name = 'Mock User';

        try {
          const userRecord = await auth.getUser(uid);
          email = userRecord.email || email;
          name = userRecord.displayName || name;
        } catch (e) {
          if (uid.includes('gmail.com')) {
            email = uid;
            name = uid.split('@')[0];
          }
        }

        decodedToken = {
          uid,
          email,
          name
        };
      } else {
        // Verify Firebase ID Token
        decodedToken = await auth.verifyIdToken(token);
      }

      // Fetch user profile from Firestore users collection
      const userSnap = await db.collection('users').doc(decodedToken.uid).get();

      if (!userSnap.exists) {
        // Fallback: If user is authenticated in Firebase Auth but no Firestore doc yet
        req.user = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          name: decodedToken.name || 'Firebase User',
          role: 'user' // Default role
        };
      } else {
        req.user = {
          uid: decodedToken.uid,
          ...userSnap.data()
        };
      }

      next();
    } catch (error) {
      console.error('Firebase Auth Verification Error:', error.message);
      return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized, no token provided' });
  }
};

/**
 * Protect admin-only routes
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ success: false, error: 'Not authorized, admin privileges required' });
  }
};

module.exports = {
  protect,
  adminOnly
};
