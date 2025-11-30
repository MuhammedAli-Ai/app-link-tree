// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // For Authentication
import { getDatabase } from "firebase/database"; // For Realtime Database

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArDuatoCzi5JUEwr1a8Y-LrTIslNTfX7E",
  authDomain: "link-tree-275d4.firebaseapp.com",
  databaseURL: "https://link-tree-275d4-default-rtdb.firebaseio.com",
  projectId: "link-tree-275d4",
  storageBucket: "link-tree-275d4.firebasestorage.app",
  messagingSenderId: "1067447565440",
  appId: "1:1067447565440:web:d013c8fecea5d978183a65",
  measurementId: "G-ZJ79932W17"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services and export them
export const analytics = getAnalytics(app);
export const auth = getAuth(app); // Initialized Firebase Authentication
export const rtdb = getDatabase(app); // Initialized Firebase Realtime Database

// You can also export the app instance if needed
export default app;