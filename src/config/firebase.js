import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: 'AIzaSyD5ZtP4j7OqvVtGQl8ULO7nNsbiHj0TQw4',
  authDomain: 'orbit2-e551b.firebaseapp.com',
  projectId: 'orbit2-e551b',
  storageBucket: 'orbit2-e551b.firebasestorage.app',
  messagingSenderId: '901982597632',
  appId: '1:901982597632:web:22dcc3a54e3e5615c49ee5',
  measurementId: 'G-Y8Z7H9SBJF',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };