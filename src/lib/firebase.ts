import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  "projectId": "studio-8483198719-4c8fb",
  "appId": "1:638530350784:web:a4d2fe8ee32b54fc80c725",
  "storageBucket": "studio-8483198719-4c8fb.firebasestorage.app",
  "apiKey": "AIzaSyB9zXxFJHqCUzTvQPICP0gGkKkB9rlxvqk",
  "authDomain": "studio-8483198719-4c8fb.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "638530350784"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
