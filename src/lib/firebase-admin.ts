
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

function initializeAdminApp() {
  if (admin.apps.length === 0) {
    try {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        storageBucket: firebaseConfig.storageBucket,
      });
    } catch (error: any) {
       if (error.code !== 'app/duplicate-app') {
        console.error('Firebase admin initialization error', error);
        // We rethrow the error to make it clear that initialization failed.
        throw error;
       }
    }
  }
  return admin;
}


// By exporting functions that get the services, we ensure 
// initialization happens before any service is accessed.
const getDb = () => {
    initializeAdminApp();
    return admin.firestore();
}

const getStorage = () => {
    initializeAdminApp();
    return admin.storage();
}


export const dbAdmin = getDb();
export const storageAdmin = getStorage();
