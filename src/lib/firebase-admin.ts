import * as admin from 'firebase-admin';

const firebaseConfig = {
  "projectId": "studio-8483198719-4c8fb",
  "appId": "1:638530350784:web:a4d2fe8ee32b54fc80c725",
  "storageBucket": "studio-8483198719-4c8fb.appspot.com",
  "apiKey": "AIzaSyB9zXxFJHqCUzTvQPICP0gGkKkB9rlxvqk",
  "authDomain": "studio-8483198719-4c8fb.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "638530350784"
};

// This is a server-only file. It uses the Firebase Admin SDK.
// It is used for backend operations that require elevated privileges,
// like writing to Firestore bypassing security rules.

if (!admin.apps.length) {
    // To connect to the emulators, you would set the FIRESTORE_EMULATOR_HOST
    // and FIREBASE_STORAGE_EMULATOR_HOST environment variables.
    // However, for this server-side logic, we'll connect to the real Firebase services.
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: firebaseConfig.projectId,
      storageBucket: firebaseConfig.storageBucket,
    });
  } catch (error: any) {
     if (error.code !== 'app/duplicate-app') {
        console.error('Firebase admin initialization error', error);
     }
  }
}

const dbAdmin = admin.firestore();
const storageAdmin = admin.storage();

export { dbAdmin, storageAdmin };
