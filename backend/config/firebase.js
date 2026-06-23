const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Self-contained in-memory mock for CI and testing environments
if (process.env.MOCK_DB === 'true' || process.env.CI === 'true') {
  console.log('--- RUNNING IN MOCK/EMULATED FIREBASE MODE FOR CI/TESTS ---');
  
  const store = {};

  const makeDoc = (path, data) => ({
    exists: data !== undefined,
    id: path.split('/').pop(),
    data: () => data,
    ref: {
      path,
      delete: async () => {
        delete store[path];
        return { writeTime: new Date() };
      }
    }
  });

  const makeQuerySnap = (docs) => ({
    empty: docs.length === 0,
    docs,
    forEach: (cb) => docs.forEach(cb)
  });

  const createCollection = (colPath) => {
    return {
      doc: (docId) => {
        const docPath = `${colPath}/${docId}`;
        return {
          id: docId,
          get: async () => makeDoc(docPath, store[docPath]),
          set: async (data) => {
            store[docPath] = { ...data };
            return { writeTime: new Date() };
          },
          update: async (data) => {
            store[docPath] = { ...store[docPath], ...data };
            return { writeTime: new Date() };
          },
          delete: async () => {
            delete store[docPath];
            return { writeTime: new Date() };
          },
          collection: (subColId) => createCollection(`${docPath}/${subColId}`)
        };
      },
      add: async (data) => {
        const docId = 'mock-doc-id-' + Math.random().toString(36).substr(2, 9);
        const docPath = `${colPath}/${docId}`;
        store[docPath] = { ...data };
        return {
          id: docId,
          path: docPath,
          get: async () => makeDoc(docPath, store[docPath]),
          set: async (newData) => {
            store[docPath] = { ...newData };
            return { writeTime: new Date() };
          },
          update: async (newData) => {
            store[docPath] = { ...store[docPath], ...newData };
            return { writeTime: new Date() };
          },
          delete: async () => {
            delete store[docPath];
            return { writeTime: new Date() };
          }
        };
      },
      get: async () => {
        const docs = [];
        for (const [key, val] of Object.entries(store)) {
          if (key.startsWith(colPath + '/') && key.replace(colPath + '/', '').split('/').length === 1) {
            docs.push(makeDoc(key, val));
          }
        }
        return makeQuerySnap(docs);
      },
      where: (field, op, val) => {
        return {
          get: async () => {
            const docs = [];
            for (const [key, docVal] of Object.entries(store)) {
              if (key.startsWith(colPath + '/') && key.replace(colPath + '/', '').split('/').length === 1) {
                if (op === '==' && docVal[field] === val) {
                  docs.push(makeDoc(key, docVal));
                }
              }
            }
            return makeQuerySnap(docs);
          }
        };
      },
      orderBy: (field, direction = 'asc') => {
        return {
          get: async () => {
            const snap = await createCollection(colPath).get();
            const docs = [...snap.docs];
            docs.sort((a, b) => {
              const valA = a.data()[field];
              const valB = b.data()[field];
              if (valA === undefined) return 1;
              if (valB === undefined) return -1;
              if (direction === 'desc') {
                return valA < valB ? 1 : (valA > valB ? -1 : 0);
              } else {
                return valA > valB ? 1 : (valA < valB ? -1 : 0);
              }
            });
            return makeQuerySnap(docs);
          }
        };
      }
    };
  };

  const db = {
    collection: (colId) => createCollection(colId),
    batch: () => {
      const operations = [];
      return {
        delete: (docRef) => {
          operations.push(() => {
            if (docRef && docRef.path) {
              delete store[docRef.path];
            }
          });
        },
        commit: async () => {
          for (const op of operations) {
            op();
          }
          return [];
        }
      };
    }
  };

  const auth = {
    createUser: async (userRecord) => {
      const uid = 'mock-user-id-' + userRecord.email.toLowerCase().replace(/[^a-z0-9]/g, '');
      store[`users/${uid}`] = {
        name: userRecord.displayName || 'Mock User',
        email: userRecord.email,
        avatar: userRecord.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        role: 'user'
      };
      return { uid, ...userRecord };
    },
    getUserByEmail: async (email) => {
      const uid = 'mock-user-id-' + email.toLowerCase().replace(/[^a-z0-9]/g, '');
      const data = store[`users/${uid}`];
      if (!data) {
        throw new Error('User not found');
      }
      return { uid, email, displayName: data.name };
    },
    getUser: async (uid) => {
      const data = store[`users/${uid}`];
      if (!data) {
        throw new Error('User not found');
      }
      return { uid, email: data.email, displayName: data.name };
    },
    verifyIdToken: async (token) => {
      if (token.startsWith('mock-')) {
        const uid = token.replace(/^mock-(id-token-|google-token-)/, '');
        return { uid, email: 'test.user@tournex.com', name: 'Mock User' };
      }
      throw new Error('Invalid token');
    }
  };

  const mockAdmin = {
    firestore: {
      FieldValue: {
        serverTimestamp: () => new Date()
      }
    }
  };

  const activeProjectId = process.env.FIREBASE_PROJECT_ID || 'tournex-74d9f';
  console.log("Connected Project ID:", activeProjectId);
  console.log("Firestore database status: READY");
  console.log("Authentication status: READY");

  module.exports = {
    admin: mockAdmin,
    db,
    auth
  };
  return;
}

const appletConfigPath = path.join(__dirname, '../../web/firebase-applet-config.json');
if (fs.existsSync(appletConfigPath)) {
  try {
    const appletConfig = JSON.parse(fs.readFileSync(appletConfigPath, 'utf8'));
    if (appletConfig && appletConfig.projectId && appletConfig.projectId.trim() !== "" && !appletConfig.projectId.startsWith("YOUR_")) {
      process.env.FIREBASE_PROJECT_ID = appletConfig.projectId;
      if (appletConfig.apiKey) {
        process.env.FIREBASE_API_KEY = appletConfig.apiKey;
      }
      console.log("Using dynamic Firebase project from applet config:", process.env.FIREBASE_PROJECT_ID);
    }
  } catch (err) {
    console.error("Error reading/parsing firebase-applet-config.json:", err.message);
  }
}

let firebaseApp;

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || './config/firebase-service-account.json';
const resolvedPath = path.resolve(serviceAccountPath);

if (fs.existsSync(resolvedPath)) {
  try {
    const serviceAccount = require(resolvedPath);
    const activeProjectId = process.env.FIREBASE_PROJECT_ID || 'tournex-74d9f';
    // Double check if the service account has actual key data and matches the active project ID before initializing with cert
    if (serviceAccount && serviceAccount.private_key && serviceAccount.project_id === activeProjectId) {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('Firebase Admin SDK initialized successfully using Service Account certificate.');
    } else {
      if (serviceAccount && serviceAccount.project_id !== activeProjectId) {
        throw new Error(`Service account project_id (${serviceAccount.project_id}) does not match active project ID (${activeProjectId})`);
      }
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

const activeProjectId = process.env.FIREBASE_PROJECT_ID || 'tournex-74d9f';
console.log("Connected Project ID:", activeProjectId);
console.log("Firestore database status: READY");
console.log("Authentication status: READY");

module.exports = {
  admin,
  db,
  auth
};
