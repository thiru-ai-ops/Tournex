const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

let firebaseApp;

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || './config/firebase-service-account.json';
const resolvedPath = path.resolve(serviceAccountPath);

if (fs.existsSync(resolvedPath)) {
  try {
    const serviceAccount = require(resolvedPath);
    // Double check if the service account has actual key data before initializing with cert
    if (serviceAccount && serviceAccount.private_key) {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('Firebase Admin SDK initialized successfully using Service Account certificate.');
    } else {
      throw new Error('Placeholder key detected: missing private_key');
    }
  } catch (error) {
    console.warn(`Fallback to default credentials initialization: ${error.message}`);
    firebaseApp = admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'tournex-74d9f'
    });
  }
} else {
  console.log('Service account file not found. Initializing Firebase Admin SDK with default credentials...');
  firebaseApp = admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || 'tournex-74d9f'
  });
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = {
  admin,
  db,
  auth
};
